import { RememberMeType } from "@dashlane/communication";
import { StoreService } from "Store";
import {
  getUserPublicSetting,
  storeUserPublicSetting,
} from "Application/ApplicationSettings";
import { removeData } from "Libs/Storage/User";
import { StorageService } from "Libs/Storage/types";
import { PersistData } from "Session/types";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { DATA_TAMPERED_ERROR } from "Libs/CryptoCenter/alter/keyBasedCrypto";
import { SessionKeys } from "Session/Store/session/types";
import { loadSessionKeys } from "Session/Store/session/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { userLoginSelector } from "Session/selectors";
import { deactivateRememberMe } from "Libs/DashlaneApi";
import {
  getDeviceAccessKeysFromSession,
  rememberMeTypeSelector,
} from "Authentication/selectors";
import { CarbonError } from "Libs/Error";
import { sendExceptionLog } from "Logs/Exception";
import { logError } from "Logs/Debugger";
import { SessionClient } from "@dashlane/session-contracts";
export enum RememberMeErrorCode {
  USER_NOT_AUTHENTICATED = "USER_NOT_AUTHENTICATED",
  EMPTY_DEVICE_KEYS = "EMPTY_DEVICE_KEYS",
  EMPTY_SESSION_KEYS = "EMPTY_SESSION_KEYS",
}
export const persistLocalAccountRememberMeType = async (
  storeService: StoreService,
  rememberMeType: RememberMeType
) => {
  const { login, persistData } = storeService.getAccountInfo();
  if (persistData === PersistData.PERSIST_DATA_YES) {
    await storeUserPublicSetting(login, "rememberMeType", rememberMeType);
  }
};
export const getLocalAccountRememberMeType = (
  login: string
): RememberMeType | undefined => getUserPublicSetting(login, "rememberMeType");
const closeServerSession = async (
  storeService: StoreService,
  session: SessionClient,
  login: string
): Promise<void> => {
  const accessKeys = await getDeviceAccessKeysFromSession(session, login);
  if (!accessKeys) {
    return;
  }
  await deactivateRememberMe(storeService, login, {
    deviceAccessKey: accessKeys,
  });
};
export const cleanRememberMeStorageData = async (
  storeService: StoreService,
  storageService: StorageService,
  session: SessionClient
) => {
  const login = userLoginSelector(storeService.getState());
  const tasks = [
    removeData(storageService, login, "authenticationKeys"),
    removeData(storageService, login, "registry"),
    persistLocalAccountRememberMeType(storeService, "disabled"),
  ];
  if (rememberMeTypeSelector(storeService.getState()) !== "disabled") {
    const disableRememberMeTask = new Promise<void>((resolve) => {
      closeServerSession(storeService, session, login)
        .then(resolve)
        .catch((error) => {
          const augmentedError = CarbonError.fromAnyError(error).addContextInfo(
            "RememberMe",
            "cleanRememberMeStorageData"
          );
          logError({
            message: "Error when deactivating remember me server side",
          });
          sendExceptionLog({ error: augmentedError });
          resolve();
        });
    });
    tasks.push(disableRememberMeTask);
  }
  await Promise.allSettled(tasks);
};
export const shouldAskMasterPassword = (login: string): boolean | undefined => {
  const rememberMeType = getLocalAccountRememberMeType(login);
  if (!["autologin", "webauthn"].includes(rememberMeType)) {
    return false;
  }
  const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
  const millisecondsSinceLastOpenSessionWithMP =
    getUserPublicSetting(login, "lastMasterPasswordOpenSessionTimestamp") ||
    undefined;
  if (!millisecondsSinceLastOpenSessionWithMP) {
    return undefined;
  }
  const today = Date.now();
  return today - millisecondsSinceLastOpenSessionWithMP > FOURTEEN_DAYS_MS;
};
export const hasSessionKeysInStorage = async (
  localStorageService: LocalStorageService
): Promise<boolean> => {
  return await localStorageService.getInstance().doesAuthenticationKeysExist();
};
export const loadSessionKeysToStore = async (
  storeService: StoreService,
  storageService: StorageService,
  localStorageService: LocalStorageService,
  sessionClient: SessionClient
): Promise<void> => {
  try {
    if (!hasSessionKeysInStorage(localStorageService)) {
      throw new Error(RememberMeErrorCode.EMPTY_SESSION_KEYS);
    }
    const keys = await localStorageService
      .getInstance()
      .getAuthenticationKeys();
    storeService.dispatch(loadSessionKeys(keys as SessionKeys));
  } catch (error) {
    if (error.message.indexOf(DATA_TAMPERED_ERROR) > -1) {
      void cleanRememberMeStorageData(
        storeService,
        storageService,
        sessionClient
      );
    }
    throw error;
  }
};
export const areSessionKeysValid = (sessionKeys: SessionKeys): boolean => {
  return sessionKeys?.expirationTimeSeconds > getUnixTimestamp();
};
