import { RememberMeType } from "@dashlane/communication";
import { StorageService } from "Libs/Storage/types";
import Debugger from "Logs/Debugger";
import {
  DataEncryptorService,
  makeDataEncryptorService,
  setObfuscatingKey,
} from "Libs/CryptoCenter/DataEncryptorService";
import { deflatedUtf8ToUtf16, utf16ToDeflatedUtf8 } from "Libs/CryptoCenter";
import { makeKeyDataEncryptorService } from "Libs/CryptoCenter/alter/keyBasedCrypto";
import { makeStoreService, StoreService } from "Store/index";
import {
  deleteUserPublicSettings,
  storeApplicationSettings,
  storeUserPublicSetting as storeUserPublicSettingActionWrapper,
} from "Application/Store/applicationSettings/actions";
import {
  ApplicationSettings,
  SyncApplicationSettings,
} from "Application/Store/applicationSettings";
import {
  commonApplicationSettingsSelector,
  publicUsersSettingsSelector,
  userPublicSettingsSelector,
} from "Application/Store/applicationSettings/selectors";
import { InitMode } from "Sdk/Default/types";
export interface UserPublicSettings {
  otp2?: boolean;
  lastSuccessfulLoginTime?: number;
  rememberMeType?: RememberMeType;
}
export interface UsersPublicSettingsStore {
  [k: string]: UserPublicSettings;
}
export interface CommonApplicationSettings {
  deviceId?: string;
  anonymousComputerId?: string;
  eventLoggerQueueKey?: string;
}
export interface ApplicationSettingsData {
  publicUsersSettings: UsersPublicSettingsStore | {};
  commonApplicationSettings: CommonApplicationSettings;
}
let _storageService: StorageService | null = null;
let _appDataCiphering: DataEncryptorService | null = null;
let _storeService: StoreService | null = null;
export function initApplicationSettings(
  storageService: StorageService,
  storeService: StoreService,
  initMode: InitMode,
  options?: {
    dataEncryptorService?: DataEncryptorService;
    settings?: Partial<ApplicationSettings>;
  }
) {
  _storageService = storageService;
  _appDataCiphering =
    (options && options.dataEncryptorService) || makeKeyDataEncryptorService();
  _storeService = storeService;
  setObfuscatingKey(_appDataCiphering);
  if (initMode === InitMode.FirstInit) {
    if (options?.settings) {
      storeService.dispatch(storeApplicationSettings(options.settings));
    }
    return loadAppSettings();
  }
  return Promise.resolve();
}
export function storeUserPublicSetting(
  login: string,
  key: string,
  value: any
): Promise<void> {
  if (!_storeService) {
    throw new Error("ApplicationSettings not initialized");
  }
  _storeService.dispatch(
    storeUserPublicSettingActionWrapper(login, { [key]: value })
  );
  return saveAppSettings();
}
export function getUserPublicSetting(login: string, key: string): any {
  if (!_storeService) {
    throw new Error("ApplicationSettings not initialized");
  }
  const userPublicSettings = userPublicSettingsSelector(
    _storeService.getState(),
    login
  );
  if (!userPublicSettings || !userPublicSettings.hasOwnProperty(key)) {
    return null;
  }
  return userPublicSettings[key];
}
export async function deleteUsersPublicSettings(
  logins: string[]
): Promise<void> {
  if (!_storeService) {
    throw new Error("ApplicationSettings not initialized");
  }
  _storeService.dispatch(deleteUserPublicSettings(logins));
  return saveAppSettings();
}
export function getUsersWithPublicSettings(): string[] {
  if (!_storeService) {
    throw new Error("ApplicationSettings not initialized");
  }
  return Object.keys(publicUsersSettingsSelector(_storeService.getState()));
}
export function storeCommonAppSetting(key: string, value: any): Promise<void> {
  const commonApplicationSettings = getCommonAppSettings();
  commonApplicationSettings[key] = value;
  return saveAppSettings();
}
export function getCommonAppSetting(key: string): string | null {
  const commonApplicationSettings = getCommonAppSettings();
  if (!commonApplicationSettings.hasOwnProperty(key)) {
    return null;
  }
  if (typeof commonApplicationSettings[key] !== "string") {
  }
  return commonApplicationSettings[key];
}
export function getCommonAppSettings(): CommonApplicationSettings {
  if (!_storeService) {
    throw new Error("ApplicationSettings not initialized");
  }
  const commonApplicationSettings = commonApplicationSettingsSelector(
    _storeService.getState()
  );
  if (!commonApplicationSettings) {
    return {};
  }
  return commonApplicationSettings;
}
const _storageKey = "ApplicationSettings.cdata";
function saveAppSettings(): Promise<void> {
  if (!_storeService || !_storageService || !_appDataCiphering) {
    throw new Error("ApplicationSettings not initialized");
  }
  const storage = _storageService.getLocalStorage();
  const applicationSettingsData: ApplicationSettingsData = {
    publicUsersSettings: publicUsersSettingsSelector(_storeService.getState()),
    commonApplicationSettings:
      commonApplicationSettingsSelector(_storeService.getState()) || {},
  };
  const clearData = JSON.stringify(applicationSettingsData);
  const bytes = utf16ToDeflatedUtf8(clearData);
  return _appDataCiphering
    .getInstance()
    .encrypt(bytes)
    .then((encryptedData) => storage.writeItem(_storageKey, encryptedData))
    .then(() => {});
}
export function loadAppSettings(): Promise<void> {
  if (!_storageService || !_appDataCiphering) {
    throw new Error("ApplicationSettings not initialized");
  }
  const storage = _storageService.getLocalStorage();
  return storage
    .itemExists(_storageKey)
    .then((exists: boolean) => {
      return exists
        ? storage.readItem(_storageKey).then((value) => {
            if (typeof value === "undefined" || value === null) {
              throw new Error("storing empty or null value is not authorized");
            }
            if (typeof value !== "string") {
              throw new Error(
                "value of ApplicationSettings.cdata is expected to be a string"
              );
            }
            return decipherApplicationSettings(_appDataCiphering, value)
              .then((decryptedData: string) => JSON.parse(decryptedData))
              .then<void>((data) => {
                setData(data);
              });
          })
        : setData(getEmptyAppSettings());
    })
    .catch((error) => {
      Debugger.error(error, "loadAppSettings");
      setData(getEmptyAppSettings());
    });
}
export function decipherApplicationSettings(
  appDataCiphering: DataEncryptorService,
  cipherData: string
) {
  return appDataCiphering
    .getInstance()
    .decrypt(cipherData)
    .then((bytes) => deflatedUtf8ToUtf16(bytes))
    .catch(() => {
      const crypto = makeDataEncryptorService(makeStoreService());
      setObfuscatingKey(crypto);
      return crypto
        .getInstance()
        .decrypt(cipherData)
        .then((bytes) => deflatedUtf8ToUtf16(bytes));
    });
}
function getEmptyAppSettings(): ApplicationSettingsData {
  return {
    publicUsersSettings: {},
    commonApplicationSettings: {},
  };
}
function setData(data: ApplicationSettingsData): void {
  if (!_storeService) {
    throw new Error("ApplicationSettings not initialized");
  }
  _storeService.dispatch(storeApplicationSettings(data));
}
export function setDataDEBUGONLY(data: ApplicationSettingsData): void {
  if (!_storeService) {
    throw new Error("ApplicationSettings not initialized");
  }
  _storeService.dispatch(storeApplicationSettings(data));
}
function getSyncAppSettings(): SyncApplicationSettings {
  if (!_storeService) {
    throw new Error("ApplicationSettings not initialized");
  }
  return _storeService.getState().device.application.settings.sync;
}
export function getSyncAppSetting(key: keyof SyncApplicationSettings) {
  const syncAppSettings = getSyncAppSettings();
  return syncAppSettings.hasOwnProperty(key) ? syncAppSettings[key] : null;
}
