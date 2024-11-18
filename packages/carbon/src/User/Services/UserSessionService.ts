import { firstValueFrom } from "rxjs";
import { ErrorName, Trigger } from "@dashlane/hermes";
import {
  ApplicationModulesAccess,
  AuthenticationCode,
  ExceptionCriticality,
  PersonalSettings,
  TwoFactorAuthenticationInfoRequestStatus,
} from "@dashlane/communication";
import { SharingSyncFeatureFlips } from "@dashlane/sharing-contracts";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import type { ClearTransaction } from "Libs/Backup/Transactions/types";
import type { RsaKeyPair } from "Libs/CryptoCenter/Primitives/AsymmetricEncryption";
import type { BackupResults, SyncArgs } from "Libs/Backup/types";
import {
  deflatedUtf8ToUtf16,
  utf16ToDeflatedUtf8,
} from "Libs/CryptoCenter/index";
import { EncryptOptions } from "Libs/CryptoCenter/types";
import { SessionServices } from "User/Services/SessionService";
import * as SessionCommunication from "Session/SessionCommunication";
import {
  applyTransactions,
  closeSession,
  localSettingsUpdated,
  openSession,
} from "Session/Store/actions";
import { resetLoginStepInfo } from "LoginStepInfo/Store/actions";
import { Debugger, logError, logInfo } from "Logs/Debugger";
import {
  loadStoredPersonalData,
  storeChangesToUpload,
  updateLastBackupTime,
} from "Session/Store/personalData/actions";
import { loadStoredPersonalSettings } from "Session/Store/personalSettings/actions";
import { sharingDataUpdated } from "Session/Store/sharingData/actions";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { StoreService } from "Store/index";
import { SyncType } from "Libs/Backup/types";
import { sync as backupSync, MAX_SYNC_TIMESTAMP } from "Libs/Backup";
import { UploadChange } from "Libs/Backup/Upload/UploadChange";
import { Account as AccountInfo } from "Session/Store/account";
import {
  syncFailure,
  syncStarted,
  syncSuccess,
} from "Session/Store/sync/actions";
import { registerLastSync } from "Session/Store/localSettings/actions";
import { syncSharing } from "Sharing/2/Services/SharingSyncService";
import { Sharing2Summary, SharingData } from "Session/Store/sharingData/types";
import { SyncUserGroupManagementStatus } from "TeamAdmin/Services/UserGroupManagementSetupService/types";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import {
  ICryptoService,
  makeCryptoService,
} from "Libs/CryptoCenter/SharingCryptoService";
import { PersistData } from "Session/types";
import { sendExceptionLog } from "Logs/Exception/index";
import {
  loadAnalyticsIds,
  updateAnalyticsIds,
  updateKeyPair,
  updateMasterPassword,
  updatePublicUserId,
  updateServerKey,
  updateSessionDidOpen,
} from "Session/Store/session/actions";
import { Session } from "Session/Store/session/index";
import { AnalyticsIds } from "Session/Store/session/types";
import { isValidLogin } from "Utils/index";
import { teamAdminDataUpdated } from "Session/Store/teamAdminData/actions";
import { WSService } from "Libs/WS/index";
import { syncUserGroupManagement } from "TeamAdmin/Services/index";
import { loadSdkAuthentication } from "Session/Store/sdk/actions";
import { getMissingIdentifiers } from "Libs/Backup/TreatProblems";
import { saveSubscriptionCode } from "Session/Store/account/actions";
import { PersonalData } from "Session/Store/personalData/types";
import { LocalSettings } from "Session/Store/localSettings/types";
import {
  announcements,
  AnnounceSync,
  SyncAnnouncementTypes,
} from "Libs/Backup/Probe";
import { makeEventLoggerSyncMonitor } from "Libs/Backup/SyncMonitorState";
import { setupProbe } from "Libs/Probe";
import { getLocalAccounts } from "Authentication/Services/get-local-accounts";
import { sessionKeysSelector, ukiSelector } from "Authentication/selectors";
import { twoFactorAuthenticationInfoSelector } from "Authentication/TwoFactorAuthentication/selectors";
import {
  loadUserAuthenticationData,
  persistUserAuthenticationData,
} from "Authentication/Storage/currentUser";
import {
  FailedToRehydrateAuthenticationData,
  isLoadAuthenticationSuccess,
} from "Authentication/Storage/types";
import { loadedStoredUserABTests } from "Session/Store/abTests/actions";
import { UserABTests } from "Session/Store/abTests/types";
import { userABTestsSelector } from "Session/Store/abTests/selector";
import {
  analyticsIdsSelector,
  isRemoteKeyActivatedSelector,
  sharingSyncSelector,
  syncIsInProgressSelector,
  syncSelector,
  userLoginSelector,
} from "Session/selectors";
import { loadNotificationsStatus } from "Session/Store/notifications/actions";
import { refreshUserABTest } from "ABTests/fetchUserABTests";
import { LocalStorageEventStore } from "Infrastructure/EventStore/LocalStorageEventStore/local-storage-event-store";
import {
  clearInstance as clearEventStoreInstance,
  getInstance as getEventStoreInstance,
  setInstance as setEventStoreInstance,
} from "EventStore/event-store-instance";
import {
  clearInstance as clearEventStoreConsumerInstance,
  getInstance as getEventStoreConsumerInstance,
  setInstance as setEventStoreConsumerInstance,
} from "EventStore/event-store-consumer-instance";
import { userActivityLastSentAtUpdated } from "Session/Store/userActivity/actions";
import { vaultReportLastSentAtUpdated } from "Session/Store/vaultReport/actions";
import { clearInstance as clearBreachesUpdaterInstance } from "DataManagement/Breaches/AppServices/breaches-updater";
import {
  clearInstance as clearIconsUpdaterInstance,
  setInstance as setIconsUpdaterInstance,
} from "DataManagement/Icons/AppServices/icons-updater-instance";
import { IconsEvent } from "DataManagement/Icons/EventStore/types";
import { IconsCacheLoaded } from "Session/Store/Icons/actions";
import { accountInfo as getAccountInfo } from "Libs/DashlaneApi/services/account/account-info";
import { isApiError } from "Libs/DashlaneApi";
import { cleanRememberMeStorageData } from "Libs/RememberMe/helpers";
import { requestPairing } from "Session/Pairing/request-pairing.app-service";
import { refreshPremiumStatus } from "Session/PremiumController";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { EventLoggerService } from "Logs/EventLogger";
import { ENFORCE_2FA_POLICY_REFRESH_TIMER_INTERVAL } from "Authentication/TwoFactorAuthentication/constants";
import { refreshTwoFactorAuthenticationInfoService } from "Authentication/TwoFactorAuthentication/services";
import type { AccountInfoResult, UserSessionService } from "./types";
import { setupEncryptorServices } from "User/Services/setup-encryptor-services";
import { setAllPendingAction } from "Session/Store/sharingSync";
import { SyncTaskTracker } from "./sync-task-tracker";
import { waitUntilSyncComplete } from "./wait-until-sync-complete";
import { CarbonError } from "Libs/Error";
import { refreshCredentialsDedupView } from "Session/CredentialsDedupViewController";
import { getEmptyPersonalDataState } from "Session/Store/personalData";
import { accountContactInfoRefreshed } from "Session/Store/account-contact-info/actions";
import {
  mapToTeamAdminSharingData,
  TeamAdminSharingData,
} from "Sharing/2/Services/team-admin-data-sync-helpers";
export const ON_USER_SESSION_CLOSED = "OnUserSessionClosed";
export interface GenerateRsaKeyPair {
  keys: RsaKeyPair;
  encryptedPrivateKey: string;
}
const _makeUserSessionService = (
  services: SessionServices,
  login: string,
  shouldOpenSession = false
): UserSessionService => {
  services.localStorageService.setInstance(login);
  if (shouldOpenSession) {
    services.storeService.dispatch(openSession(login));
  }
  const cryptoConfig = getNoDerivationCryptoConfig();
  services.teamDeviceEncryptedConfigEncryptorService.setInstance(
    {
      raw: services.storeService.getUserSession().masterPassword,
    },
    services.storeService.getUserSession().serverKey,
    cryptoConfig
  );
  setupEncryptorServices(services);
  services.localStorageService.setInstance(login);
  const cryptoService = services.cryptoService || makeCryptoService();
  const eventStore = new LocalStorageEventStore(services.localStorageService);
  setEventStoreInstance(eventStore);
  setEventStoreConsumerInstance(eventStore);
  setIconsUpdaterInstance(
    services.storeService,
    services.localStorageService,
    services.wsService
  );
  let refresh2FATimer: number = null;
  const startPeriodic2FAInfoRefresh = () => {
    if (refresh2FATimer !== null) {
      return;
    }
    const { storeService, wsService } = services;
    (refresh2FATimer = setInterval(() => {
      refreshTwoFactorAuthenticationInfoService(storeService, wsService);
    }, ENFORCE_2FA_POLICY_REFRESH_TIMER_INTERVAL) as any) as number;
  };
  const stopPeriodic2FAInfoRefresh = () => {
    clearInterval(refresh2FATimer);
  };
  const subscribeToStoreChanges = () => {
    let currentState: Session = services.storeService.getUserSession();
    services.storeService.getStore().subscribe(() => {
      const nextState: Session = services.storeService.getUserSession();
      if (nextState !== currentState) {
        if (
          (currentState.masterPassword !== nextState.masterPassword ||
            currentState.serverKey !== nextState.serverKey) &&
          nextState.masterPassword !== ""
        ) {
          Debugger.log("Master Password || Server Key updated");
          if (!nextState.masterPassword && !nextState.serverKey) {
            services.masterPasswordEncryptorService.close();
          } else {
            services.masterPasswordEncryptorService.setInstance(
              {
                raw: nextState.masterPassword,
              },
              nextState.serverKey
            );
          }
          currentState = nextState;
        }
      }
    });
  };
  subscribeToStoreChanges();
  return {
    loadSessionData: () =>
      loadSessionData(services.localStorageService, services.storeService),
    loadNonResumableSessionData: () =>
      loadNonResumableSessionData(
        services.localStorageService,
        services.storeService
      ),
    accountExistsLocally: () => doesAccountExistsLocally(services),
    refreshSessionData: () => refreshSessionData(services, login),
    getSyncArgs: () =>
      getSyncArgs(
        services.storeService,
        services.masterPasswordEncryptorService,
        services.wsService
      ),
    sync: (trigger?: Trigger) =>
      sync(services, cryptoService, stopPeriodic2FAInfoRefresh, trigger),
    attemptSync: (trigger?: Trigger) =>
      attemptSync(services, cryptoService, stopPeriodic2FAInfoRefresh, trigger),
    requestNewSync: (trigger?: Trigger) =>
      requestNewSync(
        services,
        cryptoService,
        stopPeriodic2FAInfoRefresh,
        trigger
      ),
    startPeriodic2FAInfoRefresh: () => startPeriodic2FAInfoRefresh(),
    stopPeriodic2FAInfoRefresh: () => stopPeriodic2FAInfoRefresh(),
    refreshContactInfo: () =>
      refreshContactInfo(services.storeService, services.wsService),
    fetchSubscriptionCode: () =>
      fetchSubscriptionCode(services.storeService, services.wsService),
    persistLocalSettings: () =>
      persistLocalSettings(services.localStorageService, services.storeService),
    persistPersonalData: () =>
      persistPersonalData(services.localStorageService, services.storeService),
    persistPersonalSettings: () =>
      persistPersonalSettings(
        services.localStorageService,
        services.storeService
      ),
    persistAllData: () =>
      persistAllData(services.localStorageService, services.storeService),
    persistTeamAdminData: () =>
      persistTeamAdminData(services.localStorageService, services.storeService),
    persistLocalKey: (localKey: string) =>
      services.localStorageService.getInstance().storeLocalKey(localKey),
    closeSession: (shouldReloadExtension = true) =>
      closeUserSession(
        services,
        stopPeriodic2FAInfoRefresh,
        shouldReloadExtension
      ),
    lockSession: () => lockUserSession(services),
    fetchAccountInfo: () =>
      fetchAccountInfo(
        services.storeService,
        services.storeService.getUserLogin()
      ),
  };
};
export const makeUserSessionService = (
  services: SessionServices,
  login: string,
  password: string
): UserSessionService => {
  if (!login) {
    throw new Error(AuthenticationCode[AuthenticationCode.EMPTY_LOGIN]);
  }
  const currentLogin = login.toLowerCase();
  if (!isValidLogin(currentLogin)) {
    throw new Error(AuthenticationCode[AuthenticationCode.INVALID_LOGIN]);
  }
  if (!password && password === "") {
    throw new Error(
      AuthenticationCode[AuthenticationCode.EMPTY_MASTER_PASSWORD]
    );
  }
  services.storeService.dispatch(updateMasterPassword(password));
  services.storeService.dispatch(updateServerKey(""));
  return _makeUserSessionService(services, currentLogin, true);
};
export const makeResumedUserSessionService = (
  services: SessionServices
): UserSessionService => {
  const login = userLoginSelector(services.storeService.getState());
  const currentLogin = (login ?? "").toLowerCase();
  if (!isValidLogin(currentLogin)) {
    throw new Error(
      SessionCommunication.SessionResumingCode[
        SessionCommunication.SessionResumingCode.INVALID_LOGIN_IN_STORE
      ]
    );
  }
  return _makeUserSessionService(services, currentLogin);
};
const cleanSessionData = async (
  services: SessionServices,
  cleanRememberMe: boolean
) => {
  const {
    storageService,
    storeService,
    eventBusService,
    sessionClient,
    pinCodeClient,
  } = services;
  const isUserAuthenticated = storeService.isAuthenticated();
  if (isUserAuthenticated) {
    if (cleanRememberMe) {
      await cleanRememberMeStorageData(
        storeService,
        storageService,
        sessionClient
      );
      try {
        await pinCodeClient.commands.deactivate();
      } catch (error) {
        const augmentedError = CarbonError.fromAnyError(error)
          .addContextInfo("LOGOUT", "deactivatePinCode")
          .addAdditionalInfo({
            comment: "Failed to deactivate pin code on manual logout",
          });
        await sendExceptionLog({ error: augmentedError });
      }
    }
    eventBusService.sessionClosed({
      login: null,
    });
  }
  clearBreachesUpdaterInstance();
  clearEventStoreConsumerInstance();
  clearEventStoreInstance();
  clearIconsUpdaterInstance();
  const {
    anonymousPartnerId,
    dashlaneServerDeltaTimestamp,
    appKeys,
    styxKeys,
  } = storeService.getSdkAuthentication();
  storeService.dispatch(resetLoginStepInfo());
  storeService.dispatch(updateSessionDidOpen(false));
  storeService.dispatch(closeSession());
  storeService.dispatch(
    loadSdkAuthentication({
      anonymousPartnerId,
      dashlaneServerDeltaTimestamp,
      appKeys,
      styxKeys,
    })
  );
};
const closeUserSession = async (
  services: SessionServices,
  stopPeriodic2FAInfoRefresh: () => void,
  shouldReloadExtension = true
): Promise<void> => {
  const { storeService } = services;
  const isUserAuthenticated = storeService.isAuthenticated();
  if (isUserAuthenticated) {
    await waitUntilSyncComplete(services.storeService);
    stopPeriodic2FAInfoRefresh();
  }
  await cleanSessionData(services, true);
  if (shouldReloadExtension) {
    SessionCommunication.triggerExtensionReload(storeService);
  }
};
const lockUserSession = async (services: SessionServices): Promise<void> => {
  const { storeService } = services;
  const isUserAuthenticated = storeService.isAuthenticated();
  if (!isUserAuthenticated) {
    const error = CarbonError.fromAnyError(
      new Error("No user session to lock")
    ).addContextInfo("LOCK USER SESSION", "UserSessionService");
    void sendExceptionLog({ error });
    throw error;
  }
  await cleanSessionData(services, false);
  SessionCommunication.triggerExtensionReload(storeService);
};
const attemptSync = async (
  services: SessionServices,
  cryptoService: ICryptoService,
  stopPeriodic2FAInfoRefresh: () => void,
  trigger?: Trigger
): Promise<ClearTransaction[] | undefined> => {
  try {
    return await sync(
      services,
      cryptoService,
      stopPeriodic2FAInfoRefresh,
      trigger
    );
  } catch (error) {
    const message = `Sync failed: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({
      error: augmentedError,
      code: ExceptionCriticality.WARNING,
    });
  }
};
let syncRequestPending = false;
let yieldSync = () => {};
let syncAvailable = Promise.resolve();
const awaitSync = () => {
  syncAvailable = new Promise<void>((resolve) => (yieldSync = resolve));
};
const requestNewSync = async (
  services: SessionServices,
  cryptoService: ICryptoService,
  stopPeriodic2FAInfoRefresh: () => void,
  trigger?: Trigger
): Promise<ClearTransaction[] | undefined> => {
  if (syncRequestPending) {
    return undefined;
  }
  syncRequestPending = true;
  await syncAvailable;
  syncRequestPending = false;
  return attemptSync(
    services,
    cryptoService,
    stopPeriodic2FAInfoRefresh,
    trigger
  );
};
async function doesAccountExistsLocally(
  services: SessionServices
): Promise<boolean> {
  const localAccounts = await getLocalAccounts(
    services.storeService,
    services.storageService
  );
  const userLogin = services.storeService.getUserLogin();
  const localStorageService = services.localStorageService.getInstance();
  const localAccountExist = localAccounts.some(
    ({ login }) => userLogin === login
  );
  if (localAccountExist) {
    const hasPersonalData = await localStorageService.doesPersonalDataExist();
    return Boolean(userLogin && localAccountExist && hasPersonalData);
  }
  const localDataExist = await localStorageService.doesLocalDataExist();
  return Boolean(userLogin && localDataExist);
}
const getSyncArgs = (
  storeService: StoreService,
  dataEncryptorService: DataEncryptorService,
  wsService: WSService,
  announce?: (_: SyncAnnouncementTypes) => void,
  trigger?: Trigger
): SyncArgs => {
  const localSettings = storeService.getLocalSettings();
  const login = storeService.getAccountInfo().login;
  const lastSyncTimestamp =
    trigger === Trigger.InitialLogin ? 0 : localSettings.lastSync;
  const syncType =
    trigger === Trigger.InitialLogin
      ? SyncType.FIRST_SYNC
      : SyncType.LIGHT_SYNC;
  return {
    dataEncryptorService,
    storeService,
    login,
    uki: ukiSelector(storeService.getState()),
    lastSyncTimestamp,
    syncType,
    personalData: storeService.getPersonalData(),
    needsKeys: !storeService.getUserSession().keyPair,
    ws: wsService,
    announce: announce || ((_: SyncAnnouncementTypes) => {}),
  };
};
const getSummaryOnlySyncArgs = (
  storeService: StoreService,
  dataEncryptorService: DataEncryptorService,
  wsService: WSService
): SyncArgs => {
  const syncArgs = getSyncArgs(storeService, dataEncryptorService, wsService);
  return Object.assign(syncArgs, {
    lastSyncTimestamp: MAX_SYNC_TIMESTAMP,
  });
};
type Logger = (error: Error) => Promise<void>;
const errorLogger = (task: string): Logger => {
  return (error) =>
    sendExceptionLog({
      message: `[Crypto] unable to ${task}. ErrorMessage: ${error}`,
    });
};
const loadSessionData = async (
  localStorageService: LocalStorageService,
  storeService: StoreService
): Promise<void> => {
  const personalDataPromise = localStorageService
    .getInstance()
    .getPersonalData()
    .then((personalData) => {
      Debugger.log("Personal data has been deciphered successfully");
      return personalData;
    })
    .catch((error) => {
      void sendExceptionLog({
        message: `[Crypto] unable to loadPersonalData. ErrorMessage: ${error}`,
      });
      return getEmptyPersonalDataState();
    });
  const localSettingsPromise = localStorageService
    .getInstance()
    .getLocalSettings()
    .then((localSettings) => {
      Debugger.log("Local settings have been deciphered successfully");
      return localSettings;
    })
    .catch((error) => ({
      error: true,
      logError: () => errorLogger("loadLocalSettings")(error),
    }));
  const personalSettingsPromise = localStorageService
    .getInstance()
    .getPersonalSettings()
    .then((personalSettings) => {
      Debugger.log("Personal settings have been deciphered successfully");
      return personalSettings;
    })
    .catch((error) => ({
      error: true,
      logError: () => errorLogger("loadPersonalSettings")(error),
    }));
  const notificationsStatusPromise = localStorageService
    .getInstance()
    .doesNotificationStatusExist()
    .then((doesNotificationStatusExist) => {
      if (doesNotificationStatusExist) {
        localStorageService
          .getInstance()
          .getNotificationStatus()
          .then((notificationsStatus) => {
            Debugger.log(
              "Notifications status have been deciphered successfully"
            );
            storeService.dispatch(loadNotificationsStatus(notificationsStatus));
            return notificationsStatus;
          })
          .catch((error) => ({
            error: true,
            logError: () => errorLogger("loadNotificationsStatus")(error),
          }));
      }
    });
  const userABTestsPromise = localStorageService
    .getInstance()
    .getUserABTests()
    .then((abTests) => {
      Debugger.log("User AB tests have been deciphered successfully");
      return abTests;
    })
    .catch((error) => ({
      error: true,
      logError: () => errorLogger("loadUserABTests")(error),
    }));
  const analyticsIdsPromise = localStorageService
    .getInstance()
    .getAnalyticsIds()
    .then((analyticsIds) => {
      logInfo({
        message: "User Analytics IDs have been deciphered successfully",
      });
      return analyticsIds;
    })
    .catch((error) => ({
      error: true,
      logError: () => errorLogger("loadAnalticsIds")(error),
    }));
  const loadAuthenticationDataPromise = loadUserAuthenticationData(
    localStorageService,
    storeService
  );
  const mainDataPromises = [
    personalDataPromise,
    localSettingsPromise,
    personalSettingsPromise,
  ] as Array<Promise<any>>;
  if (await localStorageService.getInstance().hasAuthenticationData()) {
    const authenticationDataPromise = loadAuthenticationDataPromise.then(
      (result) => {
        return !isLoadAuthenticationSuccess(result) &&
          result.message !== FailedToRehydrateAuthenticationData
          ? {
              error: true,
              logError: () =>
                errorLogger("loadAuthenticationData")(result.error),
            }
          : { error: false };
      }
    );
    mainDataPromises.push(authenticationDataPromise);
  }
  const mainResults = await Promise.all(mainDataPromises);
  const isWrongMasterPassword = mainResults.every((res) => !!res && res.error);
  const hasTamperedData = mainResults.some((res) => !!res && res.error);
  if (isWrongMasterPassword) {
    throw new Error(AuthenticationCode[AuthenticationCode.WRONG_PASSWORD]);
  }
  if (hasTamperedData) {
    mainResults.forEach(
      (res) => !!res && res.logError instanceof Function && res.logError()
    );
    throw new Error(AuthenticationCode[AuthenticationCode.DATA_TAMPERED_ERROR]);
  }
  try {
    storeService.dispatch(
      loadStoredPersonalData((await personalDataPromise) as PersonalData)
    );
    const localSettings = (await localSettingsPromise) as LocalSettings;
    if (localSettings) {
      const settings = localSettingsUpdated(localSettings);
      storeService.dispatch(settings);
      SessionCommunication.sendWebOnboardingModeUpdate(
        localSettings.webOnboardingMode
      );
    }
    storeService.dispatch(
      loadStoredPersonalSettings(
        (await personalSettingsPromise) as PersonalSettings
      )
    );
    storeService.dispatch(
      loadedStoredUserABTests((await userABTestsPromise) as UserABTests)
    );
    storeService.dispatch(
      loadAnalyticsIds((await analyticsIdsPromise) as AnalyticsIds)
    );
    await loadAuthenticationDataPromise.then((result) => {
      if (!isLoadAuthenticationSuccess(result)) {
        throw result.error;
      }
    });
  } catch (error) {
    const errorMessage = `An error occurred when trying to write personalData, localSettings or personalSettings in Redux store ${error} `;
    Debugger.error(errorMessage);
    throw new Error(errorMessage);
  }
  const loadSharingDataPromise = localStorageService
    .getInstance()
    .getSharingData()
    .then((data) => {
      Debugger.log(
        `sharingData loaded for ${storeService.getAccountInfo().login}`
      );
      storeService.dispatch(sharingDataUpdated(data));
    })
    .catch(errorLogger("loadSharingDataPromise"));
  const loadSharingSyncPromise = localStorageService
    .getInstance()
    .getSharingSync()
    .then((data) => {
      Debugger.log(
        `sharingSync loaded for ${storeService.getAccountInfo().login}`
      );
      storeService.dispatch(
        setAllPendingAction(data.pendingItemGroups, data.pendingUserGroups)
      );
    })
    .catch(errorLogger("loadSharingSyncPromise"));
  const loadTeamAdminDataPromise = localStorageService
    .getInstance()
    .getTeamAdminData()
    .then((data) => {
      Debugger.log(
        `teamAdminData loaded for ${storeService.getAccountInfo().login}`
      );
      storeService.dispatch(teamAdminDataUpdated(data));
    })
    .catch(errorLogger("loadTeamAdminDataPromise"));
  const loadIconsPromise = localStorageService
    .getInstance()
    .getIcons()
    .then((icons) => {
      if (icons !== null) {
        const action = IconsCacheLoaded(icons);
        storeService.dispatch(action);
      }
    })
    .catch(errorLogger("loadIconsDataPromise"));
  const loadUserActivityPromise = localStorageService
    .getInstance()
    .doesUserActivityExist()
    .then(async (exist) => {
      if (exist) {
        const { lastSentAt } = await localStorageService
          .getInstance()
          .getUserActivity();
        storeService.dispatch(userActivityLastSentAtUpdated(lastSentAt));
      }
    })
    .catch(errorLogger("loadUserActivity"));
  const loadVaultReportPromise = localStorageService
    .getInstance()
    .doesVaultReportExist()
    .then(async (exist) => {
      if (exist) {
        const { lastSentAt } = await localStorageService
          .getInstance()
          .getVaultReport();
        storeService.dispatch(vaultReportLastSentAtUpdated(lastSentAt));
      }
    })
    .catch(errorLogger("loadVaultReport"));
  return Promise.resolve().then(() => {
    Promise.all([
      loadSharingDataPromise,
      loadSharingSyncPromise,
      loadTeamAdminDataPromise,
      notificationsStatusPromise,
      loadIconsPromise,
      loadUserActivityPromise,
      loadVaultReportPromise,
    ]);
  });
};
const loadNonResumableSessionData = async (
  localStorageService: LocalStorageService,
  storeService: StoreService
): Promise<void> => {
  type Logger = (error: Error) => Promise<void>;
  const errorLogger = (task: string): Logger => {
    return (error) => {
      const message = `[Session] unable to ${task}. ErrorMessage: ${error}`;
      Debugger.error(message);
      return sendExceptionLog({ message });
    };
  };
  const doneLogger = async <T>(task: string, promise: Promise<T>) => {
    await promise;
    const login = userLoginSelector(storeService.getState());
    Debugger.log(`${task} loaded for ${login}`);
  };
  const loadPersonalDataPromise = localStorageService
    .getInstance()
    .getPersonalData()
    .then((personalData) => {
      storeService.dispatch(loadStoredPersonalData(personalData));
    })
    .catch(errorLogger("loadPersonalData"));
  const loadSharingDataPromise = localStorageService
    .getInstance()
    .getSharingData()
    .then((data) => {
      storeService.dispatch(sharingDataUpdated(data));
    })
    .catch(errorLogger("loadSharingDataPromise"));
  const loadSharingSyncPromise = localStorageService
    .getInstance()
    .getSharingSync()
    .then((data) => {
      storeService.dispatch(
        setAllPendingAction(data.pendingItemGroups, data.pendingUserGroups)
      );
    })
    .catch(errorLogger("loadSharingSyncPromise"));
  const loadTeamAdminDataPromise = localStorageService
    .getInstance()
    .getTeamAdminData()
    .then((data) => {
      storeService.dispatch(teamAdminDataUpdated(data));
    })
    .catch(errorLogger("loadTeamAdminDataPromise"));
  const loadIconsPromise = localStorageService
    .getInstance()
    .getIcons()
    .then((icons) => {
      if (icons !== null) {
        const action = IconsCacheLoaded(icons);
        storeService.dispatch(action);
      }
    })
    .catch(errorLogger("loadIconsDataPromise"));
  try {
    await Promise.all([
      doneLogger("personalData", loadPersonalDataPromise),
      doneLogger("sharingData", loadSharingDataPromise),
      doneLogger("sharingData", loadSharingSyncPromise),
      doneLogger("teamAdminData", loadTeamAdminDataPromise),
      doneLogger("iconsCacheData", loadIconsPromise),
    ]);
  } catch (error) {
    const message = `Failed to load non resumable user session data`;
    const augmentedError = new Error(message);
    logError({
      message,
      tag: ["resume"],
      details: {
        error: JSON.stringify(error),
      },
    });
    sendExceptionLog({ error: augmentedError });
  }
};
export interface HasTreatProblemsResponse {
  transactionsToDownload: string[];
  transactionsToUpload: UploadChange[];
}
export const hasTreatProblems = (
  syncResults: BackupResults,
  storeService: StoreService,
  announce: AnnounceSync
): HasTreatProblemsResponse => {
  if (!syncResults.summary) {
    return {
      transactionsToDownload: [],
      transactionsToUpload: [],
    };
  }
  const personalData = storeService.getPersonalData();
  const { missingLocally, missingRemotely } = getMissingIdentifiers(
    announce,
    personalData,
    syncResults.summary
  );
  return {
    transactionsToUpload: [...missingRemotely],
    transactionsToDownload: [...missingLocally],
  };
};
const getUpdatedBreachesIds = (transactions: ClearTransaction[]): string[] =>
  transactions
    .filter((transaction) => transaction.type === "SECURITYBREACH")
    .map((transaction) => transaction.identifier);
const getUpdatedCredentialsIds = (transactions: ClearTransaction[]): string[] =>
  transactions
    .filter((transaction) => transaction.type === "AUTHENTIFIANT")
    .map((transaction) => transaction.identifier);
const makeIconsBreachUpdatesEvent = (
  breachesIds: string[]
): IconsEvent | null => {
  if (breachesIds.length === 0) {
    return null;
  }
  return {
    type: "breachUpdates",
    breachesIds,
  };
};
const makeIconsCredentialUpdatesEvent = (
  credentialIds: string[]
): IconsEvent | null => {
  if (credentialIds.length === 0) {
    return null;
  }
  return {
    type: "credentialUpdates",
    credentialIds,
  };
};
const syncOnce = async (syncArgs: SyncArgs): Promise<BackupResults> => {
  const eventStore = getEventStoreInstance();
  const eventStoreConsumer = getEventStoreConsumerInstance();
  let iconsLockId: string | null = null;
  try {
    const { storeService, applicationModulesAccess } = syncArgs;
    const results = await backupSync(syncArgs);
    const clearTransactions = results.clearTransactions || [];
    if (clearTransactions.length !== 0) {
      iconsLockId = eventStoreConsumer.lockTopic("iconsUpdates");
      const updatedCredentialsIds = getUpdatedCredentialsIds(clearTransactions);
      const updatedBreachesIds = getUpdatedBreachesIds(clearTransactions);
      const iconsCredentialsEvent = makeIconsCredentialUpdatesEvent(
        updatedCredentialsIds
      );
      if (iconsCredentialsEvent !== null) {
        await eventStore.add("iconsUpdates", iconsCredentialsEvent);
      }
      const iconsBreachesEvent =
        makeIconsBreachUpdatesEvent(updatedBreachesIds);
      if (iconsBreachesEvent !== null) {
        await eventStore.add("iconsUpdates", iconsBreachesEvent);
      }
      const action = applyTransactions(clearTransactions);
      storeService.dispatch(action);
      SessionCommunication.reportDataUpdate(storeService);
      try {
        if (
          applicationModulesAccess &&
          (updatedCredentialsIds.length > 0 || updatedBreachesIds.length > 0)
        ) {
          const { commands } =
            applicationModulesAccess.createClients().passwordHealth;
          commands.recalculatePasswordHealth();
        }
      } catch (error) {
        const message = `Password Health update - sync: ${error}`;
        const augmentedError = new Error(message);
        sendExceptionLog({
          error: augmentedError,
          code: ExceptionCriticality.WARNING,
        });
      }
    }
    if (results.uploadedTransactions.length > 0) {
      storeService.dispatch(
        updateLastBackupTime(
          results.uploadedTransactions,
          Math.floor(results.lastSyncTimestamp / 1000)
        )
      );
    }
    if (syncArgs.lastSyncTimestamp < MAX_SYNC_TIMESTAMP) {
      storeService.dispatch(registerLastSync(results.lastSyncTimestamp));
    }
    return results;
  } catch (err) {
    throw err;
  } finally {
    if (iconsLockId) {
      eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
    }
  }
};
const chronologicalSync = async (
  syncArgs: SyncArgs
): Promise<BackupResults> => {
  const { announce, personalData } = syncArgs;
  try {
    announce(announcements.chronologicalSyncStarted(personalData));
    const results = await syncOnce(syncArgs);
    announce(
      announcements.chronologicalSyncFinished(
        results.summary,
        results.fullBackupFileSize
      )
    );
    return results;
  } catch (error) {
    announce(announcements.chronologicalSyncFailed(error));
    throw error;
  }
};
const treatProblems = async (
  storeService: StoreService,
  syncArgs: SyncArgs,
  initialResults: BackupResults
): Promise<BackupResults> => {
  const { announce } = syncArgs;
  announce(announcements.treatProblemStarted());
  const { transactionsToDownload, transactionsToUpload } = hasTreatProblems(
    initialResults,
    storeService,
    announce
  );
  const transactionsToDownloadCount = transactionsToDownload.length;
  const transactionsToUploadCount = transactionsToUpload.length;
  announce(
    announcements.treatProblemDiffComputed(
      transactionsToDownloadCount,
      transactionsToUploadCount
    )
  );
  if (transactionsToDownloadCount <= 0 && transactionsToUploadCount <= 0) {
    announce(announcements.treatProblemFinished());
    return initialResults;
  }
  try {
    if (transactionsToUploadCount > 0) {
      storeService.dispatch(storeChangesToUpload(transactionsToUpload));
    }
    const newResults = await syncOnce({
      ...getSyncArgs(
        storeService,
        syncArgs.dataEncryptorService,
        syncArgs.ws,
        announce
      ),
      transactionIds: transactionsToDownload,
    });
    const mergedResults: BackupResults = {
      ...newResults,
      clearTransactions: [
        ...newResults.clearTransactions,
        ...initialResults.clearTransactions,
      ],
    };
    announce(announcements.treatProblemFinished());
    return mergedResults;
  } catch (error) {
    announce(announcements.treatProblemFailed(error));
    throw error;
  }
};
export const storeSync = async (
  storeService: StoreService,
  syncArgs: SyncArgs
): Promise<BackupResults> => {
  const initialResults = await chronologicalSync(syncArgs);
  return treatProblems(storeService, syncArgs, initialResults);
};
interface SyncSharingDataServices {
  storeService: StoreService;
  wsService: WSService;
  localStorageService: LocalStorageService;
  eventLoggerService: EventLoggerService;
  applicationModulesAccess?: ApplicationModulesAccess;
}
const syncSharingData = async (
  {
    storeService,
    wsService,
    localStorageService,
    eventLoggerService,
    applicationModulesAccess,
  }: SyncSharingDataServices,
  announce: AnnounceSync,
  sharing2Summary: Sharing2Summary,
  trigger?: Trigger
) => {
  try {
    announce(announcements.sharingSyncStarted());
    const onInvalidData = (itemGroupId: string, errorName: ErrorName) =>
      announce(
        announcements.sharingSyncInvalidSyncData(itemGroupId, errorName)
      );
    const sharingData = await syncSharing(
      {
        storeService,
        wsService,
        localStorageService,
        eventLoggerService,
        applicationModulesAccess,
      },
      sharing2Summary,
      onInvalidData,
      trigger
    );
    announce(announcements.sharingSyncFinished());
    return sharingData;
  } catch (error) {
    announce(announcements.sharingSyncFailed(error));
    throw error;
  }
};
const syncTeamAdminData = async (
  storeService: StoreService,
  wsService: WSService,
  announce: AnnounceSync,
  sharingData: TeamAdminSharingData
): Promise<SyncUserGroupManagementStatus> => {
  try {
    announce(announcements.teamAdminDataSyncStarted());
    const teamAdminDataResult = await syncUserGroupManagement(
      storeService,
      wsService,
      sharingData
    );
    announce(announcements.teamAdminDataSyncFinished());
    return teamAdminDataResult;
  } catch (error) {
    announce(announcements.teamAdminDataSyncFailed(error));
    throw error;
  }
};
interface SyncSharingAndTeamAdminDataServices {
  storeService: StoreService;
  dataEncryptorService: DataEncryptorService;
  localStorageService: LocalStorageService;
  wsService: WSService;
  eventLoggerService: EventLoggerService;
  applicationModulesAccess: ApplicationModulesAccess;
}
const syncSharingAndTeamAdminData = async (
  {
    storeService,
    dataEncryptorService,
    localStorageService,
    wsService,
    eventLoggerService,
    applicationModulesAccess,
  }: SyncSharingAndTeamAdminDataServices,
  announce: AnnounceSync,
  initialResults: BackupResults,
  trigger?: Trigger
): Promise<BackupResults> => {
  if (!initialResults.sharing2 || !ukiSelector(storeService.getState())) {
    return initialResults;
  }
  const refreshSharingAndTeamAdminDataOnce = async (
    sharing2Summary: Sharing2Summary
  ): Promise<SyncUserGroupManagementStatus> => {
    const { userFeatureFlip } =
      applicationModulesAccess.createClients().featureFlips.queries;
    const featureFlipResult = await firstValueFrom(
      userFeatureFlip({
        featureFlip: SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
      })
    );
    const sharingSyncInGrapheneEnabled = isSuccess(featureFlipResult)
      ? getSuccess(featureFlipResult)
      : false;
    if (sharingSyncInGrapheneEnabled) {
      const { getTeamAdminSharingData } =
        applicationModulesAccess.createClients().sharingSync.queries;
      const { runSharingSync } =
        applicationModulesAccess.createClients().sharingSync.commands;
      const { collections, itemGroups, items, userGroups } = sharing2Summary;
      await runSharingSync({
        summary: {
          collections: collections ?? [],
          itemGroups,
          items,
          userGroups,
        },
      });
      const teamAdminDataResult = await firstValueFrom(
        getTeamAdminSharingData()
      );
      if (isSuccess(teamAdminDataResult)) {
        const teamAdminData = getSuccess(teamAdminDataResult);
        const teamAdminSyncResult = await syncTeamAdminData(
          storeService,
          wsService,
          announce,
          teamAdminData
        );
        return teamAdminSyncResult;
      }
    } else {
      const sharingData = await syncSharingData(
        {
          storeService,
          wsService,
          localStorageService,
          eventLoggerService,
          applicationModulesAccess,
        },
        announce,
        sharing2Summary,
        trigger
      );
      const teamAdminSyncResult = await syncTeamAdminData(
        storeService,
        wsService,
        announce,
        sharingData ? mapToTeamAdminSharingData(sharingData) : {}
      );
      return teamAdminSyncResult;
    }
  };
  const syncStatus = await refreshSharingAndTeamAdminDataOnce(
    initialResults.sharing2
  );
  if (syncStatus === SyncUserGroupManagementStatus.NEEDS_FRESH_SHARING_DATA) {
    const summaryOnlySyncArgs = getSummaryOnlySyncArgs(
      storeService,
      dataEncryptorService,
      wsService
    );
    const { sharing2: updatedSharingSummary } = await storeSync(storeService, {
      ...summaryOnlySyncArgs,
      applicationModulesAccess,
      announce,
    });
    await refreshSharingAndTeamAdminDataOnce(updatedSharingSummary);
  }
  return initialResults;
};
export const isSyncInProgress = (storeService: StoreService): boolean => {
  const state = storeService.getState();
  const isInProgress = syncIsInProgressSelector(state);
  const { startTime } = syncSelector(state);
  if (!isInProgress) {
    return false;
  }
  const minutes = 10;
  const timeLimitForInProgressSync = 1000 * 60 * minutes;
  const timeElapsedSinceSyncStart = Date.now() - (startTime || 0);
  if (timeElapsedSinceSyncStart < timeLimitForInProgressSync) {
    Debugger.log("[Sync] Already in progress, skipping trigger…");
    return true;
  }
  storeService.dispatch(syncFailure());
  sendExceptionLog({
    message: `[Sync] "inProgress" for more than ${minutes} minutes`,
  });
  return false;
};
const sync = async (
  services: SessionServices,
  cryptoService: ICryptoService,
  stopPeriodic2FAInfoRefresh: () => void,
  trigger?: Trigger
): Promise<ClearTransaction[] | undefined> => {
  const {
    applicationModulesAccess,
    eventBusService,
    localStorageService,
    masterPasswordEncryptorService,
    remoteDataEncryptorService,
    storeService,
    wsService,
    eventLoggerService,
    taskTrackingClient,
  } = services;
  const state = storeService.getState();
  if (!storeService.isAuthenticated()) {
    throw new Error("Impossible to Sync - user not authenticated");
  }
  if (isSyncInProgress(storeService)) {
    return undefined;
  }
  awaitSync();
  const twoFactorAuthenticationInfo =
    twoFactorAuthenticationInfoSelector(state);
  if (
    twoFactorAuthenticationInfo.status ===
    TwoFactorAuthenticationInfoRequestStatus.READY
  ) {
    const { shouldEnforceTwoFactorAuthentication } =
      twoFactorAuthenticationInfo;
    if (shouldEnforceTwoFactorAuthentication) {
      return undefined;
    }
  }
  const syncTaskTracker = new SyncTaskTracker(taskTrackingClient);
  await syncTaskTracker.startTracking();
  const isRemoteKeyActivated = isRemoteKeyActivatedSelector(state);
  const dataEncryptorService = isRemoteKeyActivated
    ? remoteDataEncryptorService
    : masterPasswordEncryptorService;
  const announce = setupProbe(
    makeEventLoggerSyncMonitor(eventLoggerService).monitor
  );
  const syncArgs = {
    ...getSyncArgs(
      storeService,
      dataEncryptorService,
      wsService,
      announce,
      trigger
    ),
    applicationModulesAccess,
  };
  const { syncType } = syncArgs;
  try {
    announce(announcements.syncStarted(trigger, syncType));
    SessionCommunication.triggerSessionSyncStatus({ status: "syncing" });
    storeService.dispatch(syncStarted());
    const results = await storeSync(storeService, syncArgs);
    await treatKeysResult(
      dataEncryptorService,
      storeService,
      cryptoService,
      wsService,
      announce,
      results
    );
    await syncSharingAndTeamAdminData(
      {
        storeService,
        dataEncryptorService,
        localStorageService,
        wsService,
        eventLoggerService,
        applicationModulesAccess,
      },
      announce,
      results,
      trigger
    );
    await dataEncryptorService.getInstance().prepareCrypto();
    announce(announcements.saveStarted());
    await persistAllData(localStorageService, storeService);
    announce(announcements.saveFinished());
    eventBusService.syncSuccess({});
    storeService.dispatch(syncSuccess(results.isUploadEnabled));
    SessionCommunication.triggerSessionSyncStatus({ status: "success" });
    announce(announcements.syncFinished());
    yieldSync();
    return results.clearTransactions;
  } catch (error) {
    storeService.dispatch(syncFailure());
    SessionCommunication.triggerSessionSyncStatus({ status: "error" });
    announce(announcements.syncFailed(error));
    eventBusService.syncFailure({});
    yieldSync();
    if (error.message === AuthenticationCode[AuthenticationCode.INVALID_UKI]) {
      const message = `[Sync] Device UKI is invalid, closing the session`;
      const augmentedError = new Error(message);
      logError({ message, details: { error: augmentedError } });
      sendExceptionLog({ error: augmentedError });
      closeUserSession(services, stopPeriodic2FAInfoRefresh);
      return undefined;
    }
    throw error;
  } finally {
    syncTaskTracker.terminateTracking();
  }
};
export const treatKeysResult = async (
  dataEncryptorService: DataEncryptorService,
  storeService: StoreService,
  cryptoService: ICryptoService,
  wsService: WSService,
  announce: AnnounceSync,
  result: BackupResults
): Promise<void> => {
  try {
    const decipherPrivateKey = async (key: string): Promise<string> => {
      Debugger.log("[Sync] Extract Keys from Sync…");
      if (!key) {
        return null;
      }
      Debugger.log("[Sync] Decipher  private key BEGIN");
      const bytes = await dataEncryptorService.getInstance().decrypt(key);
      const decryptedData = deflatedUtf8ToUtf16(bytes, {
        skipInflate: true,
      });
      Debugger.log("[Sync] Decipher  private key SUCCESS");
      return decryptedData;
    };
    if (result.keys && result.keys.privateKey) {
      try {
        const privateKey = await decipherPrivateKey(result.keys.privateKey);
        storeService.dispatch(
          updateKeyPair({
            privateKey: privateKey,
            publicKey: result.keys.publicKey,
          })
        );
      } catch (_error) {}
    }
    if (!storeService.getUserSession().keyPair) {
      const rsaKeys: GenerateRsaKeyPair = await generateRsaKeys(
        dataEncryptorService,
        cryptoService
      );
      const syncArgs = getSummaryOnlySyncArgs(
        storeService,
        dataEncryptorService,
        wsService
      );
      syncArgs.needsKeys = true;
      syncArgs.syncType = SyncType.FULL_SYNC;
      syncArgs.pushKeysToServer = {
        private: rsaKeys.encryptedPrivateKey,
        public: rsaKeys.keys.publicKey,
      };
      Debugger.log("SYNC RSA Keys - BEGIN");
      await syncOnce(syncArgs);
      Debugger.log("SYNC RSA Keys - END");
      storeService.dispatch(
        updateKeyPair({
          privateKey: rsaKeys.keys.privateKey,
          publicKey: rsaKeys.keys.publicKey,
        })
      );
    }
  } catch (error) {
    announce(announcements.treatSharingKeysFailed(error));
    throw error;
  }
};
export const generateRsaKeys = async (
  dataEncryptor: DataEncryptorService,
  cryptoService: ICryptoService,
  encryptOptions: EncryptOptions = {}
): Promise<GenerateRsaKeyPair> => {
  try {
    const keys: RsaKeyPair =
      await cryptoService.asymmetricEncryption.generateRsaKeyPair();
    Debugger.log("Generating RSA Keys");
    const bytes = utf16ToDeflatedUtf8(keys.privateKey, {
      skipDeflate: true,
    });
    const encryptedPrivateKey = await dataEncryptor
      .getInstance()
      .encrypt(bytes, encryptOptions);
    Debugger.log("Encrypt RSA Keys");
    const rsaKeys = {
      keys: {
        publicKey: keys.publicKey,
        privateKey: keys.privateKey,
      },
      encryptedPrivateKey,
    } as GenerateRsaKeyPair;
    return rsaKeys;
  } catch (error) {
    Debugger.log("Error while Generating RSA KEY: " + error);
    throw error;
  }
};
const shouldNotPersistData = (accountInfo: AccountInfo): boolean => {
  return accountInfo.persistData === PersistData.PERSIST_DATA_NO;
};
const persistLocalSettings = (
  localStorageService: LocalStorageService,
  storeService: StoreService
): Promise<void> => {
  const localSettings = storeService.getLocalSettings();
  const accountInfo = storeService.getAccountInfo();
  if (shouldNotPersistData(accountInfo) || !accountInfo.isAuthenticated) {
    return Promise.resolve();
  }
  return localStorageService.getInstance().storeLocalSettings(localSettings);
};
const persistPersonalData = async (
  localStorageService: LocalStorageService,
  storeService: StoreService
): Promise<void> => {
  const personalData = storeService.getPersonalData();
  const accountInfo = storeService.getAccountInfo();
  if (shouldNotPersistData(accountInfo) || !accountInfo.isAuthenticated) {
    return Promise.resolve();
  }
  return localStorageService.getInstance().storePersonalData(personalData);
};
const persistPersonalSettings = async (
  localStorageService: LocalStorageService,
  storeService: StoreService
): Promise<void> => {
  const personalSettings = storeService.getPersonalSettings();
  const accountInfo = storeService.getAccountInfo();
  if (shouldNotPersistData(accountInfo) || !accountInfo.isAuthenticated) {
    return Promise.resolve();
  }
  return localStorageService
    .getInstance()
    .storePersonalSettings(personalSettings);
};
const persistTeamAdminData = (
  localStorageService: LocalStorageService,
  storeService: StoreService
): Promise<void> => {
  const teamAdminData = storeService.getTeamAdminData();
  const accountInfo = storeService.getAccountInfo();
  if (shouldNotPersistData(accountInfo) || !accountInfo.isAuthenticated) {
    return Promise.resolve();
  }
  return localStorageService
    .getInstance()
    .storeTeamAdminData(teamAdminData)
    .then(() => {});
};
const persistAllData = async (
  localStorageService: LocalStorageService,
  storeService: StoreService
): Promise<void> => {
  const abTests = userABTestsSelector(storeService.getState());
  const localSettings = storeService.getLocalSettings();
  const personalSettings = storeService.getPersonalSettings();
  const sharingData = storeService.getSharingData();
  const sharingSync = sharingSyncSelector(storeService.getState());
  const accountInfo = storeService.getAccountInfo();
  const notificationsStatus = storeService.getNotificationStatus();
  const teamAdminData = storeService.getTeamAdminData();
  const state = storeService.getState();
  const authenticationKeys = sessionKeysSelector(state);
  const analyticsIds = analyticsIdsSelector(state);
  const storeAuthenticationKeysPromise = () =>
    authenticationKeys
      ? localStorageService
          .getInstance()
          .storeAuthenticationKeys(authenticationKeys)
      : Promise.resolve();
  if (shouldNotPersistData(accountInfo) || !accountInfo.isAuthenticated) {
    return Promise.resolve();
  }
  if (isNaN(localSettings.lastSync)) {
    sendExceptionLog({
      message: "Persisting localSettings with a NaN lastSyncTimestamp",
      code: ExceptionCriticality.WARNING,
    });
  }
  const teams = teamAdminData?.teams ?? {};
  const specialItemGroupItemIds = Object.keys(teams).reduce((acc, teamId) => {
    const team = teamAdminData.teams[teamId];
    const ids = team.specialItemGroup
      ? (team.specialItemGroup.items || []).map((i) => i.itemId)
      : [];
    return acc.concat(ids);
  }, []);
  const sharingDataLight: SharingData = {
    ...sharingData,
    items: sharingData.items.map((item) => {
      if (!item.content || specialItemGroupItemIds.includes(item.itemId)) {
        return item;
      }
      return { ...item, content: "" };
    }),
  };
  await Promise.all([
    persistPersonalData(localStorageService, storeService),
    persistLocalSettings(localStorageService, storeService),
    localStorageService.getInstance().storePersonalSettings(personalSettings),
    localStorageService.getInstance().storeSharingData(sharingDataLight),
    localStorageService.getInstance().storeSharingSync(sharingSync),
    localStorageService
      .getInstance()
      .storeNotificationsStatus(notificationsStatus),
    storeAuthenticationKeysPromise(),
    localStorageService.getInstance().storeTeamAdminData(teamAdminData),
    persistUserAuthenticationData(localStorageService, storeService),
    localStorageService.getInstance().storeUserABTests(abTests),
    localStorageService.getInstance().storeAnalyticsIds(analyticsIds),
  ]);
};
const refreshContactInfo = async (
  storeService: StoreService,
  wsService: WSService
) => {
  try {
    const login = storeService.getAccountInfo().login;
    const uki = ukiSelector(storeService.getState());
    const { result, ...contactInfo } =
      await wsService.contactInfo.getContactInfo({ login, uki });
    storeService.dispatch(accountContactInfoRefreshed(contactInfo));
  } catch (error) {
    const message = "Failed to refreshContactInfo";
    const augmentedError = CarbonError.fromAnyError(error)
      .addContextInfo("session", "refreshContactInfo")
      .addAdditionalInfo({
        message,
        originalError: error,
      });
    logError({
      message,
      details: {
        error: JSON.stringify(error),
      },
    });
    sendExceptionLog({ error: augmentedError });
  }
};
function fetchSubscriptionCode(
  storeService: StoreService,
  wsService: WSService
): Promise<string> {
  const login = storeService.getAccountInfo().login;
  const uki = ukiSelector(storeService.getState());
  return wsService.premium
    .getSubscriptionCode({ login, uki })
    .then((result) => {
      const subscriptionCode =
        result && result.content && result.content.subscriptionCode;
      storeService.dispatch(saveSubscriptionCode(subscriptionCode));
      return subscriptionCode;
    });
}
function fetchAccountInfo(
  storeService: StoreService,
  login: string
): Promise<AccountInfoResult> {
  const userSession = storeService.getUserSession();
  const analyticsIds = userSession.analyticsIds;
  const publicUserId = userSession.publicUserId;
  const idsExist =
    analyticsIds.userAnalyticsId &&
    analyticsIds.deviceAnalyticsId &&
    publicUserId;
  if (idsExist) {
    return Promise.resolve({
      userAnalyticsId: analyticsIds.userAnalyticsId,
      deviceAnalyticsId: analyticsIds.deviceAnalyticsId,
      publicUserId: publicUserId,
    });
  }
  return getAccountInfo(storeService, login).then((response) => {
    if (isApiError(response) || response.code !== "success") {
      throw new Error("Unable to fetch updated account info");
    }
    storeService.dispatch(
      updateAnalyticsIds(response.userAnalyticsId, response.deviceAnalyticsId)
    );
    storeService.dispatch(updatePublicUserId(response.publicUserId));
    return {
      userAnalyticsId: response.userAnalyticsId,
      deviceAnalyticsId: response.deviceAnalyticsId,
      publicUserId: response.publicUserId,
    };
  });
}
async function refreshSessionData(
  services: SessionServices,
  login: string
): Promise<void> {
  const { localStorageService, storeService, wsService } = services;
  const pairingPromise = requestPairing(storeService, login);
  const abTestsPromise = refreshUserABTest(
    storeService,
    localStorageService.getInstance(),
    login
  );
  const uki = ukiSelector(storeService.getState());
  const premiumStatusPromise = refreshPremiumStatus(
    storeService,
    wsService,
    login,
    uki
  );
  const refreshCredentialsDedupViewPromise = refreshCredentialsDedupView(
    storeService,
    login
  );
  await Promise.all([
    premiumStatusPromise,
    pairingPromise,
    abTestsPromise,
    refreshCredentialsDedupViewPromise,
  ]);
}
