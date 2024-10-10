import {
  type ConfirmAccountCreationRequest,
  type ConfirmAccountCreationResult,
  Country,
  type PersonalSettings,
  type PlatformInfo,
} from "@dashlane/communication";
import { Trigger, UserSyncEvent } from "@dashlane/hermes";
import type { Transaction } from "Libs/Backup/Transactions/types";
import type { BackupResults, SyncArgs } from "Libs/Backup/types";
import { sync } from "Libs/Backup";
import { SyncType } from "Libs/Backup/types";
import { PersistData } from "Session/types";
import { GenerateRsaKeyPair } from "User/Services/UserSessionService";
import { makeLoginController } from "Login/LoginController";
import {
  updateAnalyticsIds,
  updateIsFirstSessionAfterAccountCreation,
  updateKeyPair,
} from "Session/Store/session/actions";
import { CoreServices } from "Services/";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getEmptyPersonalDataState } from "Session/Store/personalData";
import { loadStoredPersonalSettings } from "Session/Store/personalSettings/actions";
import { secureDeviceName } from "Device/secure-device-name";
import { announcements } from "Libs/Backup/Probe";
import { setupProbe } from "Libs/Probe";
import { makeEventLoggerSyncMonitor } from "Libs/Backup/SyncMonitorState";
import { makeSyncLoggerMonitor } from "Libs/Backup/Logs";
import {
  createUser,
  CreateUserRequest,
  CreateUserSuccess,
  isApiError,
  makeSafeCountry,
  makeSafeDeviceName,
  makeSafeLanguage,
} from "Libs/DashlaneApi";
import { convertDeviceKeysToUki } from "Store/helpers/Device";
import { EventLoggerService } from "Logs/EventLogger";
import { createUploadChange } from "Libs/Backup/Upload/UploadChange/upload-change.factories";
export async function createAccount(
  services: CoreServices,
  confirmAccountCreationRequest: ConfirmAccountCreationRequest,
  settingsPromise: Promise<Transaction>,
  personalSettings: PersonalSettings,
  accountKeyPromise: Promise<GenerateRsaKeyPair>
): Promise<ConfirmAccountCreationResult> {
  const platformInfo = services.storeService.getPlatform().info;
  if (!confirmAccountCreationRequest.createAccountResult.valid) {
    throw new Error(
      "Account creation: Will not perform API request for invalidated settings promise"
    );
  }
  const [settingsTransaction, sharingKeys] = await Promise.all([
    settingsPromise,
    accountKeyPromise,
  ]);
  const result = await createAccountOnServer(
    services,
    platformInfo,
    confirmAccountCreationRequest,
    personalSettings,
    settingsTransaction,
    sharingKeys
  );
  await firstSync(services, confirmAccountCreationRequest, result);
  const uki = convertDeviceKeysToUki({
    accessKey: result.deviceAccessKey,
    secretKey: result.deviceSecretKey,
  });
  return {
    m2dToken: result.token,
    abtestingversion: result.abTestingVersion,
    uki,
    origin: result.origin,
    openSession: confirmAccountCreationRequest.isStandAlone,
  };
}
async function createAccountOnServer(
  services: CoreServices,
  platformInfo: PlatformInfo,
  confirmAccountCreationRequest: ConfirmAccountCreationRequest,
  personalSettings: PersonalSettings,
  settingsTransaction: Transaction,
  sharingKeys: GenerateRsaKeyPair
): Promise<CreateUserSuccess> {
  const { storeService } = services;
  const { createAccountResult } = confirmAccountCreationRequest;
  const abTestingVersion = services.storeService.getABTesting().version;
  let consents = confirmAccountCreationRequest.consents;
  if (!Array.isArray(consents)) {
    consents = [
      {
        consentType: "emailsOffersAndTips",
        status: createAccountResult.encryptSettingsRequest.subscribe,
      },
    ];
  }
  const login = createAccountResult.encryptSettingsRequest.login;
  if (platformInfo.platformName === "server_carbon_unknown") {
    throw new Error("Unexpected uninitialized platform info");
  }
  const request: CreateUserRequest = {
    abTestingVersion,
    askM2dToken: true,
    country: makeSafeCountry(
      services.storeService.getLocation().country || platformInfo.country
    ),
    deviceName: makeSafeDeviceName(
      secureDeviceName(createAccountResult.encryptSettingsRequest.deviceName)
    ),
    language: makeSafeLanguage(platformInfo.lang),
    login,
    osCountry: makeSafeCountry(platformInfo.country),
    osLanguage: makeSafeLanguage(platformInfo.lang),
    platform: platformInfo.platformName,
    settings: {
      content: settingsTransaction.content,
      time: settingsTransaction.time,
    },
    appVersion: platformInfo.appVersion,
    contactEmail: login,
    consents,
    sharingKeys: {
      publicKey: sharingKeys.keys.publicKey,
      privateKey: sharingKeys.encryptedPrivateKey,
    },
    temporaryDevice: !confirmAccountCreationRequest.isStandAlone,
  };
  const response = await createUser(storeService, request);
  if (isApiError(response)) {
    throw new Error(
      `[AccountCreation] - createAccountOnServer : ${response.message} (${response.code})`
    );
  }
  services.storeService.dispatch(updateIsFirstSessionAfterAccountCreation());
  services.storeService.dispatch(
    updateKeyPair({
      publicKey: sharingKeys.keys.publicKey,
      privateKey: sharingKeys.keys.privateKey,
    })
  );
  services.storeService.dispatch(loadStoredPersonalSettings(personalSettings));
  services.storeService.dispatch(
    updateAnalyticsIds(response.userAnalyticsId, response.deviceAnalyticsId)
  );
  return response;
}
interface FirstSyncOptions {
  useRemoteKey?: boolean;
}
export async function firstSync(
  services: CoreServices,
  confirmAccountCreationRequest: ConfirmAccountCreationRequest,
  createUserResult: CreateUserSuccess,
  options: FirstSyncOptions = { useRemoteKey: false }
): Promise<void> {
  const createAccountResult = confirmAccountCreationRequest.createAccountResult;
  const { login } = createAccountResult.encryptSettingsRequest;
  const emailId = generateItemUuid();
  const personalData = getEmptyPersonalDataState();
  personalData.emails.push({
    Email: login,
    EmailName: "Email 1",
    Id: emailId,
    kwType: "KWEmail",
    LastBackupTime: 0,
    LocaleFormat: Country.UNIVERSAL,
    SpaceId: "",
    Type: "PERSO",
  });
  personalData.changesToUpload.push(
    createUploadChange({
      action: "EDIT",
      itemId: emailId,
      kwType: "KWEmail",
    })
  );
  const { monitor, getSyncEvent } = makeEventLoggerSyncMonitor(
    services.eventLoggerService,
    { sendLogOnSyncComplete: false }
  );
  const announce = setupProbe(monitor, makeSyncLoggerMonitor());
  const deviceKeys = {
    accessKey: createUserResult.deviceAccessKey,
    secretKey: createUserResult.deviceSecretKey,
  };
  const uki = convertDeviceKeysToUki(deviceKeys);
  const dataEncryptorService = options.useRemoteKey
    ? services.remoteDataEncryptorService
    : services.masterPasswordEncryptorService;
  const syncStartTimestamp: number = Date.now();
  const syncType = SyncType.FULL_SYNC;
  const syncArgs: SyncArgs = {
    storeService: services.storeService,
    dataEncryptorService: dataEncryptorService,
    login,
    uki,
    lastSyncTimestamp: syncStartTimestamp,
    personalData,
    syncType,
    needsKeys: false,
    ws: services.wsService,
    announce,
  };
  let backupResults: BackupResults = null;
  try {
    announce(
      announcements.syncStarted(Trigger.AccountCreation, syncType),
      announcements.chronologicalSyncStarted(personalData)
    );
    backupResults = await sync(syncArgs);
    announce(
      announcements.chronologicalSyncFinished(backupResults.summary),
      announcements.syncFinished()
    );
  } catch (error) {
    announce(
      announcements.chronologicalSyncFailed(error),
      announcements.syncFailed(error)
    );
    throw error;
  }
  if (confirmAccountCreationRequest.isStandAlone) {
    const loginController = makeLoginController(services);
    await loginController.loadAccountCreationInfos(
      login,
      createAccountResult.encryptSettingsRequest.password,
      secureDeviceName(createAccountResult.encryptSettingsRequest.deviceName),
      deviceKeys,
      backupResults.lastSyncTimestamp,
      PersistData.PERSIST_DATA_YES
    );
    await loginController.openSession(login, {
      password: createAccountResult.encryptSettingsRequest.password,
    });
  }
  const sendWacSyncEventPromise = sendSyncEvent(
    services.eventLoggerService,
    getSyncEvent()
  );
  if (!confirmAccountCreationRequest.isStandAlone) {
    await sendWacSyncEventPromise;
  }
}
async function sendSyncEvent(
  eventLoggerService: EventLoggerService,
  syncEvent: Partial<UserSyncEvent>
) {
  await eventLoggerService.logSync(
    new UserSyncEvent({
      duration: syncEvent.duration,
      error: syncEvent.error,
      extent: syncEvent.extent,
      fullBackupSize: syncEvent.fullBackupSize,
      incomingDeleteCount: syncEvent.incomingDeleteCount,
      incomingUpdateCount: syncEvent.incomingUpdateCount,
      outgoingDeleteCount: syncEvent.outgoingDeleteCount,
      outgoingUpdateCount: syncEvent.outgoingUpdateCount,
      timestamp: syncEvent.timestamp,
      trigger: syncEvent.trigger,
      treatProblem: syncEvent.treatProblem,
    })
  );
  return eventLoggerService.flushEventQueue();
}
