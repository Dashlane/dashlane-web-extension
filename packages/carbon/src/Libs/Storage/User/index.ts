import {
  AuthenticationCode,
  CarbonLegacyClient,
  FileNamesList,
  FileNamesStorageKey,
  FileRevisionMapper,
  Notifications,
  PersonalSettings,
} from "@dashlane/communication";
import Debugger, { log } from "Logs/Debugger";
import { PersonalData } from "Session/Store/personalData/types";
import { __REDACTED__ } from "UserManagement/is-internal-test-user";
import { LocalSettings } from "Session/Store/localSettings/types";
import { SharingData } from "Session/Store/sharingData/types";
import { SharingSyncState } from "Session/Store/sharingSync";
import { TeamAdminData } from "Session/Store/teamAdminData";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import type { UserLocalDataServices } from "Libs/Storage/Local/types";
import { StorageService } from "Libs/Storage/types";
import { DeviceKeys } from "Store/helpers/Device";
import { AnalyticsIds, SessionKeys } from "Session/Store/session/types";
import { utf8ChunkDecode } from "Libs/CryptoCenter/Helpers/Helper";
import { CurrentUserAuthenticationState } from "Authentication/Store/currentUser/types";
import { UserABTests } from "Session/Store/abTests/types";
import { isLocalKeyActivatedSelector } from "Session/selectors";
import { UserActivityState } from "Session/Store/userActivity/types";
import { VaultReportState } from "Session/Store/vaultReport/types";
import { CarbonEventStore } from "EventStore/carbon-event-store";
import { IconsCache } from "Session/Store/Icons";
import { iconsFromStorage, iconsToStorage } from "Session/Store/Icons/helpers";
import {
  deflatedUtf8ToUtf16,
  deflateUtf16,
  inflateUtf16,
} from "Libs/CryptoCenter/index";
const base64 = require("base-64") as any;
export const StoredUserDataTypeEnum = [
  "abTests",
  "authentication",
  "authenticationKeys",
  "eventStore",
  "health",
  "healthWasComputed",
  "icons",
  "localDataBackupLastLoginSuccessful",
  "localDataBackupTmp",
  "localKey",
  "localSettings",
  "notificationsStatus",
  "personalData",
  "personalSettings",
  "recoveryData",
  "recoveryLocalKey",
  "recoverySessionCredential",
  "registry",
  "remoteFileContent",
  "remoteFileMeta",
  "sharingData",
  "sharingSync",
  "teamAdminData",
  "userActivity",
  "vaultReport",
  "analyticsIds",
] as const;
export type StoredUserDataType =
  | (typeof StoredUserDataTypeEnum)[number]
  | FileNamesStorageKey;
export interface LocalDataOptions {
  isLocalKeyActivated?: boolean;
}
export interface UserLocalDataService {
  doesLocalDataExist: () => Promise<boolean>;
  storePersonalData: (personalData: PersonalData) => Promise<void>;
  getPersonalData: () => Promise<PersonalData>;
  doesPersonalDataExist: () => Promise<boolean>;
  doesAuthenticationKeysExist: () => Promise<boolean>;
  storeLocalSettings: (localSettings: LocalSettings) => Promise<void>;
  getLocalSettings: () => Promise<LocalSettings>;
  storePersonalSettings: (personalSettings: PersonalSettings) => Promise<void>;
  getPersonalSettings: () => Promise<PersonalSettings>;
  storeNotificationsStatus: (
    notificationsStatus: Notifications
  ) => Promise<void>;
  doesNotificationStatusExist: () => Promise<boolean>;
  getNotificationStatus: () => Promise<Notifications>;
  storeSharingData: (sharingData: SharingData) => Promise<void>;
  getSharingData: () => Promise<SharingData>;
  storeSharingSync: (sharingSync: SharingSyncState) => Promise<void>;
  getSharingSync: () => Promise<SharingSyncState>;
  doesSharingSyncExist: () => Promise<boolean>;
  storeTeamAdminData: (teamAdminData: TeamAdminData) => Promise<void>;
  getTeamAdminData: () => Promise<TeamAdminData>;
  storeAuthenticationKeys: (data: AuthenticationKeys) => Promise<void>;
  getAuthenticationKeys: () => Promise<AuthenticationKeys>;
  storeAuthenticationData: (
    data: CurrentUserAuthenticationState
  ) => Promise<void>;
  getAuthenticationData: () => Promise<CurrentUserAuthenticationState>;
  hasAuthenticationData: () => Promise<boolean>;
  doesMasterPasswordExist: () => Promise<boolean>;
  clearMasterPassword: () => Promise<void>;
  getMasterPassword: () => Promise<string>;
  storeMasterPassword: (masterPassword: string) => Promise<void>;
  getWebAuthnMasterPassword: () => Promise<string>;
  storeWebAuthnMasterPassword: (masterPassword: string) => Promise<void>;
  storeLocalKey: (localKey: string) => Promise<void>;
  getLocalKey: () => Promise<string>;
  doesLocalKeyExist: () => Promise<boolean>;
  cleanAuthenticationKey: () => Promise<void>;
  storeUserABTests: (abTests: UserABTests) => Promise<void>;
  getUserABTests: () => Promise<UserABTests>;
  storeIcons: (icons: IconsCache) => Promise<void>;
  getIcons: () => Promise<IconsCache | null>;
  doesUserActivityExist: () => Promise<boolean>;
  getUserActivity: () => Promise<UserActivityState>;
  storeUserActivity: (userActivity: UserActivityState) => Promise<void>;
  doesVaultReportExist: () => Promise<boolean>;
  getVaultReport: () => Promise<VaultReportState>;
  storeVaultReport: (vaultReport: VaultReportState) => Promise<void>;
  storeEventStore: (store: Partial<CarbonEventStore>) => Promise<void>;
  getEventStore: () => Promise<Partial<CarbonEventStore> | null>;
  storeRecoveryLocalKey: (localKeyRecoveryEncrypted: string) => Promise<void>;
  getRecoveryLocalKey: () => Promise<string>;
  cleanRecoverySetupData: () => Promise<void>;
  doesRecoveryLocalKeyExist: () => Promise<boolean>;
  storeRecoverySessionCredential: (
    credentialEncrypted: string
  ) => Promise<void>;
  cleanRecoveryData: () => Promise<void>;
  getRecoverySessionCredential: () => Promise<string>;
  doesRecoverySessionCredentialExist: () => Promise<boolean>;
  storeRecoveryData: (recoveryData: string) => Promise<void>;
  getRecoveryData: () => Promise<string>;
  doesRecoveryDataExist: () => Promise<boolean>;
  getAnalyticsIds: () => Promise<AnalyticsIds>;
  storeAnalyticsIds: (analyticsIds: AnalyticsIds) => Promise<void>;
  doesAnalyticsIdsExist: () => Promise<boolean>;
  storeRemoteFileContent: (
    fileName: FileNamesStorageKey,
    fileContents: string
  ) => Promise<void>;
  storeRemoteFileMeta: (fileMeta: Partial<FileRevisionMapper>) => Promise<void>;
  getRemoteFileContent: (fileName: FileNamesStorageKey) => Promise<string>;
  getRemoteFileMeta: () => Promise<Partial<FileRevisionMapper>>;
  cleanAllRemoteFiles: () => Promise<void>;
  cleanSingleFileStorage: (fileName: FileNamesStorageKey) => Promise<void>;
  isRemoteFileMetaDataExist: () => Promise<boolean>;
  isRemoteFileContentExist: (fileName: FileNamesStorageKey) => Promise<boolean>;
}
export type AuthenticationKeys = DeviceKeys | SessionKeys;
export const STORAGE_VERSION = "v1";
export const getStorageKey = (
  login: string,
  dataType: StoredUserDataType,
  version = STORAGE_VERSION
) => {
  return `${login}.${dataType}.${version}`;
};
export const getStorageDebugKey = (
  login: string,
  dataType: StoredUserDataType,
  version = STORAGE_VERSION
) => {
  return getStorageKey(login, dataType, version) + ".clear";
};
const getLegacyStorageKey = (login: string, dataType: StoredUserDataType) => {
  return `${login}.${dataType}`;
};
const getLegacyStorageDebugKey = (
  login: string,
  dataType: StoredUserDataType
) => {
  return getLegacyStorageKey(login, dataType) + ".clear";
};
const getStoredData = async (
  storageService: StorageService,
  dataType: StoredUserDataType,
  key: string
): Promise<string> => {
  const value = await storageService.getLocalStorage().readItem(key);
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`value ${dataType} undefined`);
  }
  return value;
};
const getUtf8StoredData = async (
  dataEncryptorService: DataEncryptorService,
  storageService: StorageService,
  dataType: StoredUserDataType,
  key: string
): Promise<any> => {
  const data = await getStoredData(storageService, dataType, key);
  const bytes = await dataEncryptorService.getInstance().decrypt(data);
  const clearBase64Text = deflatedUtf8ToUtf16(bytes, {
    skipUtf8Decoding: true,
  });
  if (clearBase64Text.length === 0) {
    throw new Error(AuthenticationCode[AuthenticationCode.WRONG_PASSWORD]);
  }
  const utf8EncodedText = base64.decode(clearBase64Text);
  try {
    const dataStr = utf8ChunkDecode(utf8EncodedText);
    return JSON.parse(dataStr);
  } catch (error) {
    Debugger.log(error);
    return utf8EncodedText;
  }
};
const getUtf16StoredData = async (
  dataEncryptorService: DataEncryptorService,
  storageService: StorageService,
  dataType: StoredUserDataType,
  key: string
): Promise<any> => {
  const data = await getStoredData(storageService, dataType, key);
  const bytes = await dataEncryptorService.getInstance().decrypt(data);
  const dataStr = inflateUtf16(bytes);
  return JSON.parse(dataStr);
};
const getAndDecipherStoredData = async (
  dataEncryptorService: DataEncryptorService,
  storageService: StorageService,
  login: string,
  dataType: StoredUserDataType
): Promise<any> => {
  const localStorageService = storageService.getLocalStorage();
  const key = getStorageKey(login, dataType);
  const hasKey = await localStorageService.itemExists(key);
  if (hasKey) {
    return getUtf16StoredData(
      dataEncryptorService,
      storageService,
      dataType,
      key
    );
  }
  const legacyKey = getLegacyStorageKey(login, dataType);
  const hasLegacyKey = await localStorageService.itemExists(legacyKey);
  if (hasLegacyKey) {
    return getUtf8StoredData(
      dataEncryptorService,
      storageService,
      dataType,
      legacyKey
    );
  }
  const error = new Error("value " + dataType + " undefined");
  Debugger.error(error);
  throw error;
};
const encryptAndStoreData = async (
  dataEncryptorService: DataEncryptorService,
  storageService: StorageService,
  login: string,
  data: any,
  dataType: StoredUserDataType
): Promise<void> => {
  const dataStr = JSON.stringify(data);
  const bytes = deflateUtf16(dataStr);
  const encryptedData = await dataEncryptorService.getInstance().encrypt(bytes);
  await storeData(storageService, login, encryptedData, dataType, data);
};
export const isDataStored = async (
  storageService: StorageService,
  login: string,
  dataType: StoredUserDataType
): Promise<boolean> => {
  const localStorage = storageService.getLocalStorage();
  const key = getStorageKey(login, dataType);
  const hasKey = await localStorage.itemExists(key);
  if (hasKey) {
    return true;
  }
  const legacyKey = getLegacyStorageKey(login, dataType);
  return await localStorage.itemExists(legacyKey);
};
async function deleteGrapheneLocalKeys(
  carbonClient: CarbonLegacyClient,
  login: string
): Promise<void> {
  await carbonClient.commands.mitigationDeleteGrapheneUserData({ login });
}
export async function deleteAllLocalUserData(
  storageService: StorageService,
  carbonClient: CarbonLegacyClient,
  login: string
): Promise<void> {
  const loginToRemove = login.trim();
  await Promise.all(
    [...StoredUserDataTypeEnum, ...FileNamesList].map(async (key) => {
      await removeData(storageService, loginToRemove, key);
    })
  );
  await deleteGrapheneLocalKeys(carbonClient, login);
}
export const makeUserLocalDataService = (
  userLocalDataService: UserLocalDataServices,
  login: string
): UserLocalDataService => {
  const getDataEncryptorService = () => {
    const {
      storeService,
      masterPasswordEncryptorService,
      localDataEncryptorService,
    } = userLocalDataService;
    const isLocalKeyActivated = isLocalKeyActivatedSelector(
      storeService.getState()
    );
    return isLocalKeyActivated
      ? localDataEncryptorService
      : masterPasswordEncryptorService;
  };
  return {
    storePersonalData: (personalData: PersonalData) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        personalData,
        "personalData"
      );
    },
    getPersonalData: () => {
      Debugger.log("Load Personal Data");
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "personalData"
      ) as Promise<PersonalData>;
    },
    doesPersonalDataExist: (): Promise<boolean> => {
      Debugger.log("Check Personal Data existence");
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "personalData"
      );
    },
    storeLocalSettings: (localSettings: LocalSettings) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        localSettings,
        "localSettings"
      );
    },
    getLocalSettings: () => {
      Debugger.log("Load Local Settings");
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "localSettings"
      ) as Promise<LocalSettings>;
    },
    storePersonalSettings: (personalSettings: PersonalSettings) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        personalSettings,
        "personalSettings"
      );
    },
    getPersonalSettings: () => {
      Debugger.log("Load Personal Settings");
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "personalSettings"
      ) as Promise<PersonalSettings>;
    },
    storeNotificationsStatus: (notificationsStatus: Notifications) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        notificationsStatus,
        "notificationsStatus"
      );
    },
    doesNotificationStatusExist: () => {
      Debugger.log("Check Notification Status existence");
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "notificationsStatus"
      );
    },
    getNotificationStatus: () => {
      Debugger.log("Load Notifications Status");
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "notificationsStatus"
      );
    },
    storeSharingData: (sharingData: SharingData) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        sharingData,
        "sharingData"
      );
    },
    getSharingData: () => {
      Debugger.log("Load Sharing Data");
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "sharingData"
      );
    },
    storeSharingSync: (sharingSync: SharingSyncState) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        sharingSync,
        "sharingSync"
      );
    },
    getSharingSync: () => {
      Debugger.log("Load Sharing Sync");
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "sharingSync"
      );
    },
    doesSharingSyncExist: (): Promise<boolean> => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "sharingSync"
      );
    },
    storeTeamAdminData: (teamAdminData: TeamAdminData) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        teamAdminData,
        "teamAdminData"
      );
    },
    getTeamAdminData: () => {
      Debugger.log("Load Team Admin Data");
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "teamAdminData"
      );
    },
    storeAuthenticationKeys: (data: AuthenticationKeys) => {
      return encryptAndStoreData(
        userLocalDataService.authorizationKeysEncryptorService,
        userLocalDataService.storageService,
        login,
        data,
        "authenticationKeys"
      );
    },
    getAuthenticationKeys: () => {
      Debugger.log("Load Authentication Keys");
      return getAndDecipherStoredData(
        userLocalDataService.authorizationKeysEncryptorService,
        userLocalDataService.storageService,
        login,
        "authenticationKeys"
      ).then((sdkData) => sdkData);
    },
    doesAuthenticationKeysExist: (): Promise<boolean> => {
      Debugger.log("Check Authentication Keys existence");
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "authenticationKeys"
      );
    },
    cleanAuthenticationKey: () => {
      return removeData(
        userLocalDataService.storageService,
        login,
        "authenticationKeys"
      );
    },
    storeAuthenticationData: (
      userAuthentication: CurrentUserAuthenticationState
    ) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        userAuthentication,
        "authentication"
      );
    },
    getAuthenticationData: () => {
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "authentication"
      );
    },
    hasAuthenticationData: (): Promise<boolean> => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "authentication"
      );
    },
    doesMasterPasswordExist: () => {
      Debugger.log("Check Master Password Keys existence");
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "registry"
      );
    },
    clearMasterPassword: async () => {
      const storageService = userLocalDataService.storageService;
      await removeData(storageService, login, "registry");
    },
    getMasterPassword: () => {
      Debugger.log("Load Master Password via Auto login");
      return getAndDecipherStoredData(
        userLocalDataService.autoLoginEncryptorService,
        userLocalDataService.storageService,
        login,
        "registry"
      );
    },
    storeMasterPassword: (masterPassword: string) => {
      Debugger.log("Store Master Password via Auto login");
      return encryptAndStoreData(
        userLocalDataService.autoLoginEncryptorService,
        userLocalDataService.storageService,
        login,
        masterPassword,
        "registry"
      );
    },
    getWebAuthnMasterPassword: () => {
      Debugger.log("Load Master Password via WebAuthn login");
      return getAndDecipherStoredData(
        userLocalDataService.webAuthnAuthenticationEncryptorService,
        userLocalDataService.storageService,
        login,
        "registry"
      );
    },
    storeWebAuthnMasterPassword: (masterPassword: string) => {
      Debugger.log("Store Master Password via WebAuthn login");
      return encryptAndStoreData(
        userLocalDataService.webAuthnAuthenticationEncryptorService,
        userLocalDataService.storageService,
        login,
        masterPassword,
        "registry"
      );
    },
    getLocalKey: () => {
      return getAndDecipherStoredData(
        userLocalDataService.masterPasswordEncryptorService,
        userLocalDataService.storageService,
        login,
        "localKey"
      );
    },
    doesLocalKeyExist: () => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "localKey"
      );
    },
    storeLocalKey: (localKey: string) => {
      return encryptAndStoreData(
        userLocalDataService.masterPasswordEncryptorService,
        userLocalDataService.storageService,
        login,
        localKey,
        "localKey"
      );
    },
    doesLocalDataExist: () => {
      const importantLocalDataTypes: StoredUserDataType[] = [
        "localSettings",
        "personalData",
        "personalSettings",
      ];
      return Promise.all(
        importantLocalDataTypes.map((key) =>
          isDataStored(userLocalDataService.storageService, login, key)
        )
      ).then((localDataExist) =>
        localDataExist.every((localDataExist) => localDataExist)
      );
    },
    storeUserABTests: (abTests: UserABTests) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        abTests,
        "abTests"
      );
    },
    getUserABTests: () => {
      Debugger.log("Load User AB Tests");
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "abTests"
      );
    },
    storeIcons: async (iconsCache) => {
      const storable = iconsToStorage(iconsCache);
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        storable,
        "icons"
      );
    },
    getIcons: async () => {
      const isStored = await isDataStored(
        userLocalDataService.storageService,
        login,
        "icons"
      );
      if (!isStored) {
        return null;
      }
      const data = await getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "icons"
      );
      return iconsFromStorage(data);
    },
    doesUserActivityExist: () => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "userActivity"
      );
    },
    storeUserActivity: () => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        {},
        "userActivity"
      );
    },
    getUserActivity: () => {
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "userActivity"
      );
    },
    doesVaultReportExist: () => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "vaultReport"
      );
    },
    storeVaultReport: (vaultReport: VaultReportState) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        vaultReport,
        "vaultReport"
      );
    },
    getVaultReport: () => {
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "vaultReport"
      );
    },
    storeEventStore: (eventStore: CarbonEventStore) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        eventStore,
        "eventStore"
      );
    },
    getEventStore: async () => {
      const isStored = await isDataStored(
        userLocalDataService.storageService,
        login,
        "eventStore"
      );
      if (!isStored) {
        return null;
      }
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "eventStore"
      );
    },
    storeRecoveryLocalKey: async (localKeyRecoveryEncrypted: string) => {
      const storageService = userLocalDataService.storageService;
      return storeData(
        storageService,
        login,
        localKeyRecoveryEncrypted,
        "recoveryLocalKey"
      );
    },
    getRecoveryLocalKey: async () => {
      const key = getStorageKey(login, "recoveryLocalKey");
      return await getStoredData(
        userLocalDataService.storageService,
        "recoveryLocalKey",
        key
      );
    },
    storeRecoverySessionCredential: (sessionCredential: string) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        sessionCredential,
        "recoverySessionCredential"
      );
    },
    getRecoverySessionCredential: async () => {
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "recoverySessionCredential"
      ) as Promise<string>;
    },
    doesRecoverySessionCredentialExist: async () => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "recoverySessionCredential"
      );
    },
    cleanRecoverySetupData: async () => {
      const storageService = userLocalDataService.storageService;
      await removeData(storageService, login, "recoverySessionCredential");
      return await removeData(storageService, login, "recoveryLocalKey");
    },
    doesRecoveryLocalKeyExist: async () => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "recoveryLocalKey"
      );
    },
    cleanRecoveryData: async () => {
      const storageService = userLocalDataService.storageService;
      return await removeData(storageService, login, "recoveryData");
    },
    storeRecoveryData: async (recoveryDataEncrypted: string) => {
      const storageService = userLocalDataService.storageService;
      return await storeData(
        storageService,
        login,
        recoveryDataEncrypted,
        "recoveryData"
      );
    },
    getRecoveryData: async () => {
      const key = getStorageKey(login, "recoveryData");
      return await getStoredData(
        userLocalDataService.storageService,
        "recoveryData",
        key
      );
    },
    doesRecoveryDataExist: () => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "recoveryData"
      );
    },
    storeAnalyticsIds: (analyticsIds: AnalyticsIds) => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        analyticsIds,
        "analyticsIds"
      );
    },
    getAnalyticsIds: () => {
      log({ message: "Load Analytics IDs" });
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "analyticsIds"
      );
    },
    doesAnalyticsIdsExist: (): Promise<boolean> => {
      log({ message: "Check Analytics IDs existence" });
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "analyticsIds"
      );
    },
    storeRemoteFileContent: (
      fileName: FileNamesStorageKey,
      fileContentState: string
    ): Promise<void> => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        fileContentState,
        fileName
      );
    },
    storeRemoteFileMeta: (
      fileMeta: Partial<FileRevisionMapper>
    ): Promise<void> => {
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        fileMeta,
        "remoteFileMeta"
      );
    },
    getRemoteFileMeta: (): Promise<Partial<FileRevisionMapper>> => {
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "remoteFileMeta"
      );
    },
    getRemoteFileContent: (fileName: FileNamesStorageKey): Promise<string> => {
      return getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        fileName
      );
    },
    cleanAllRemoteFiles: async (): Promise<void> => {
      const storageService = userLocalDataService.storageService;
      await removeData(storageService, login, "remoteFileMeta");
      for (const key of FileNamesList) {
        await removeData(storageService, login, key);
      }
    },
    cleanSingleFileStorage: async (
      fileName: FileNamesStorageKey
    ): Promise<void> => {
      const storageService = userLocalDataService.storageService;
      await removeData(storageService, login, fileName);
      const fileMeta: FileRevisionMapper = await getAndDecipherStoredData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        "remoteFileMeta"
      );
      delete fileMeta[fileName];
      return encryptAndStoreData(
        getDataEncryptorService(),
        userLocalDataService.storageService,
        login,
        fileMeta,
        "remoteFileMeta"
      );
    },
    isRemoteFileMetaDataExist: (): Promise<boolean> => {
      return isDataStored(
        userLocalDataService.storageService,
        login,
        "remoteFileMeta"
      );
    },
    isRemoteFileContentExist: (
      fileName: FileNamesStorageKey
    ): Promise<boolean> => {
      return isDataStored(userLocalDataService.storageService, login, fileName);
    },
  };
};
