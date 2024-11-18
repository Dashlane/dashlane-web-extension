import { env } from "@dashlane/browser-utils";
import { StoreService } from "Store";
import { WSService } from "Libs/WS/index";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { generateAESKey } from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import { bufferToBase64 } from "Libs/CryptoCenter/Helpers/Helper";
import {
  loadSessionKeys,
  updateMasterPassword,
} from "Session/Store/session/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { sendExceptionLog } from "Logs/Exception/index";
import { logError } from "Logs/Debugger";
import {
  getDeviceKeysFromSession,
  sessionKeysSelector,
} from "Authentication/selectors";
import {
  getMasterPasswordCipheringKey,
  initRememberMasterPassword,
  isApiError,
} from "Libs/DashlaneApi";
import { masterPasswordSelector, userLoginSelector } from "Session/selectors";
import {
  areSessionKeysValid,
  hasSessionKeysInStorage,
  loadSessionKeysToStore,
  persistLocalAccountRememberMeType,
  RememberMeErrorCode,
} from "Libs/RememberMe/helpers";
import { setRememberMeTypeAction } from "Authentication/Store/currentUser/actions";
import { getWindowLocalStorage } from "Helpers/window-localStorage";
import { SessionClient } from "@dashlane/session-contracts";
export const AUTOLOGIN_EXPIRATION_DATE = 14 * 24 * 60 * 60;
const QA_STORAGE_KEY = "***";
export interface AutoLoginService {
  initialize: () => Promise<void>;
  process: (login: string) => Promise<void>;
  shouldTrigger: (login: string) => Promise<boolean>;
}
export interface AutoLoginServiceParams {
  storeService: StoreService;
  wsService: WSService;
  localStorageService: LocalStorageService;
  autoLoginEncryptorService: DataEncryptorService;
  authorizationKeysEncryptorService: DataEncryptorService;
  sessionClient: SessionClient;
}
export const createMasterPasswordCipheringKey = () => {
  return generateAESKey();
};
export const shouldTrigger = async (
  storeService: StoreService,
  localStorageService: LocalStorageService,
  login: string
): Promise<boolean> => {
  try {
    localStorageService.setInstance(login);
    if (storeService.isAuthenticated()) {
      return false;
    }
    if (!(await hasSessionKeysInStorage(localStorageService))) {
      return false;
    }
    await loadSessionKeysToStore(storeService, localStorageService);
    const sessionKeys = sessionKeysSelector(storeService.getState());
    if (!areSessionKeysValid(sessionKeys)) {
      return false;
    }
    return localStorageService.getInstance().doesMasterPasswordExist();
  } catch (error) {
    if (error.message !== RememberMeErrorCode.EMPTY_SESSION_KEYS) {
      const message = `[Autologin] - shouldTrigger: ${error}`;
      const augmentedError = new Error(message);
      sendExceptionLog({ error: augmentedError });
      logError(error);
    }
    return false;
  }
};
export const loadMPFromStorageToStore = async (
  storeService: StoreService,
  autoLoginEncryptorService: DataEncryptorService,
  localStorageService: LocalStorageService,
  login: string
): Promise<void> => {
  const result = await getMasterPasswordCipheringKey(storeService, login);
  if (isApiError(result)) {
    throw new Error(result.message);
  }
  autoLoginEncryptorService.setInstance(
    {
      raw: result.rememberMasterPasswordCipheringKey,
    },
    ""
  );
  const masterPassword = await localStorageService
    .getInstance()
    .getMasterPassword();
  storeService.dispatch(updateMasterPassword(masterPassword));
};
const processAutoLogin = async (
  service: AutoLoginServiceParams,
  login: string
): Promise<void> => {
  try {
    const { storeService, autoLoginEncryptorService, localStorageService } =
      service;
    const shouldProcess = await shouldTrigger(
      storeService,
      localStorageService,
      login
    );
    if (!shouldProcess) {
      return;
    }
    return await loadMPFromStorageToStore(
      storeService,
      autoLoginEncryptorService,
      localStorageService,
      login
    );
  } catch (error) {
    const message = `[Autologin] - processAutoLogin: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    logError(augmentedError);
  }
};
export const makeAutoLoginService = (
  options: AutoLoginServiceParams
): AutoLoginService => {
  return {
    initialize: () => initialize(options),
    process: (login: string) => processAutoLogin(options, login),
    shouldTrigger: (login: string) =>
      shouldTrigger(options.storeService, options.localStorageService, login),
  };
};
