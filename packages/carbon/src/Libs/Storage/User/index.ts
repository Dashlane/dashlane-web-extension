import { AuthenticationCode, CarbonLegacyClient, FileNamesList, FileNamesStorageKey, FileRevisionMapper, Notifications, PersonalSettings, } from "@dashlane/communication";
import Debugger, { log } from "Logs/Debugger";
import { PersonalData } from "Session/Store/personalData/types";
import { *** } from "UserManagement/is-internal-test-user";
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
import { deflatedUtf8ToUtf16, deflateUtf16, inflateUtf16, } from "Libs/CryptoCenter/index";
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
export type StoredUserDataType = (typeof StoredUserDataTypeEnum)[number] | FileNamesStorageKey;
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
    storeNotificationsStatus: (notificationsStatus: Notifications) => Promise<void>;
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
    storeAuthenticationData: (data: CurrentUserAuthenticationState) => Promise<void>;
    getAuthenticationData: () => Promise<CurrentUserAuthenticationState>;
    hasAuthenticationData: () => Promise<boolean>;
    doesMasterPasswordExist: () => Promise<boolean>;
    getMasterPassword: () => Promise<string>;
    storeMasterPassword: (masterPassword: string) => Promise<void>;
    getWebAuthnMasterPassword: () => Promise<string>;
    storeWebAuthnMasterPassword: (masterPassword: string) => Promise<void>;
    storeLocalKey: (localKey: string) => Promise<void>;
    getLocalKey: () => Promise<string>;
    doesLocalKeyExist: () => Promise<boolean>;
    cleanAuthenticationKey: () => Promise<void>;
    ***: (abTests: UserABTests) => Promise<void>;
    ***: () => Promise<UserABTests>;
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
    storeRecoverySessionCredential: (credentialEncrypted: string) => Promise<void>;
    cleanRecoveryData: () => Promise<void>;
    getRecoverySessionCredential: () => Promise<string>;
    doesRecoverySessionCredentialExist: () => Promise<boolean>;
    storeRecoveryData: (recoveryData: string) => Promise<void>;
    getRecoveryData: () => Promise<string>;
    doesRecoveryDataExist: () => Promise<boolean>;
    getAnalyticsIds: () => Promise<AnalyticsIds>;
    storeAnalyticsIds: (analyticsIds: AnalyticsIds) => Promise<void>;
    doesAnalyticsIdsExist: () => Promise<boolean>;
    storeRemoteFileContent: (fileName: FileNamesStorageKey, fileContents: string) => Promise<void>;
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
export const getStorageKey = (login: string, dataType: StoredUserDataType, version = STORAGE_VERSION) => {
    return `${login}.${dataType}.${version}`;
};
export const getStorageDebugKey = (login: string, dataType: StoredUserDataType, version = STORAGE_VERSION) => {
    return getStorageKey(login, dataType, version) + ".clear";
};
const getLegacyStorageKey = (login: string, dataType: StoredUserDataType) => {
    return `${login}.${dataType}`;
};
const getLegacyStorageDebugKey = (login: string, dataType: StoredUserDataType) => {
    return getLegacyStorageKey(login, dataType) + ".clear";
};
const getStoredData = async (storageService: StorageService, dataType: StoredUserDataType, key: string): Promise<string> => {
    const value = await storageService.getLocalStorage().readItem(key);
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`value ${dataType} undefined`);
    }
    return value;
};
const getUtf8StoredData = async (dataEncryptorService: DataEncryptorService, storageService: StorageService, dataType: StoredUserDataType, key: string): Promise<any> => {
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
    }
    catch (error) {
        Debugger.log(error);
        return utf8EncodedText;
    }
};
const getUtf16StoredData = async (dataEncryptorService: DataEncryptorService, storageService: StorageService, dataType: StoredUserDataType, key: string): Promise<any> => {
    const data = await getStoredData(storageService, dataType, key);
    const bytes = await dataEncryptorService.getInstance().decrypt(data);
    const dataStr = inflateUtf16(bytes);
    return JSON.parse(dataStr);
};
const getAndDecipherStoredData = async (dataEncryptorService: DataEncryptorService, storageService: StorageService, login: string, dataType: StoredUserDataType): Promise<any> => {
    const localStorageService = storageService.getLocalStorage();
    const key = getStorageKey(login, dataType);
    const hasKey = await localStorageService.itemExists(key);
    if (hasKey) {
        return getUtf16StoredData(dataEncryptorService, storageService, dataType, key);
    }
    const legacyKey = getLegacyStorageKey(login, dataType);
    const hasLegacyKey = await localStorageService.itemExists(legacyKey);
    if (hasLegacyKey) {
        return getUtf8StoredData(dataEncryptorService, storageService, dataType, legacyKey);
    }
    const error = new Error("value " + dataType + " undefined");
    Debugger.error(error);
    throw error;
};
const encryptAndStoreData = async (dataEncryptorService: DataEncryptorService, storageService: StorageService, login: string, data: any, dataType: StoredUserDataType): Promise<void> => {
    const dataStr = JSON.stringify(data);
    const bytes = deflateUtf16(dataStr);
    const encryptedData = await dataEncryptorService.getInstance().encrypt(bytes);
    await storeData(storageService, login, encryptedData, dataType, data);
};
export const isDataStored = async (storageService: StorageService, login: string, dataType: StoredUserDataType): Promise<boolean> => {
    const localStorage = storageService.getLocalStorage();
    const key = getStorageKey(login, dataType);
    const hasKey = await localStorage.itemExists(key);
    if (hasKey) {
        return true;
    }
    const legacyKey = getLegacyStorageKey(login, dataType);
    return await localStorage.itemExists(legacyKey);
};
async function deleteGrapheneLocalKeys(carbonClient: CarbonLegacyClient, login: string): Promise<void> {
    await carbonClient.commands.mitigationDeleteGrapheneUserData({ login });
}
export async function deleteAllLocalUserData(storageService: StorageService, carbonClient: CarbonLegacyClient, login: string): Promise<void> {
    const loginToRemove = login.trim();
    await Promise.all([...StoredUserDataTypeEnum, ...FileNamesList].map(async (key) => {
        await removeData(storageService, loginToRemove, key);
    }));
    await deleteGrapheneLocalKeys(carbonClient, login);
}
