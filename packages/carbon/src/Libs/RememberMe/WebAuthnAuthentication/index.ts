import { bufferToBase64 } from "Libs/CryptoCenter/Helpers/Helper";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { logError } from "Logs/Debugger";
import { generate64BytesKey } from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import {
  getDeviceAccessKeysFromSession,
  sessionKeysSelector,
} from "Authentication/selectors";
import {
  completeRememberMeOpenSession,
  completeRememberMeRegistration,
  deactivateRememberMe,
  isApiError,
} from "Libs/DashlaneApi";
import {
  isAuthenticatedSelector,
  masterPasswordSelector,
  userLoginSelector,
} from "Session/selectors";
import {
  loadSessionKeys,
  updateMasterPassword,
} from "Session/Store/session/actions";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { sendExceptionLog } from "Logs/Exception/index";
import { StoreService } from "Store";
import {
  AssertionAuthenticator,
  AttestationAuthenticator,
} from "Authentication/WebAuthnAuthentication/types";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import {
  areSessionKeysValid,
  hasSessionKeysInStorage,
  loadSessionKeysToStore,
  persistLocalAccountRememberMeType,
  RememberMeErrorCode,
} from "Libs/RememberMe/helpers";
import { setRememberMeTypeAction } from "Authentication/Store/currentUser/actions";
import { SessionClient } from "@dashlane/session-contracts";
import type { StorageService } from "Libs/Storage/types";
export interface WebAuthnAuthenticationService {
  initialize: (
    authenticator: AttestationAuthenticator | AssertionAuthenticator
  ) => Promise<boolean>;
  process: (
    login: string,
    authenticator: AssertionAuthenticator
  ) => Promise<void>;
  shouldTrigger: (login: string) => Promise<boolean>;
  deactivate: (login: string) => Promise<boolean>;
}
export interface WebAuthnAuthenticationServiceParams {
  storeService: StoreService;
  storageService: StorageService;
  localStorageService: LocalStorageService;
  webAuthnAuthenticationEncryptorService: DataEncryptorService;
  authorizationKeysEncryptorService: DataEncryptorService;
  sessionClient: SessionClient;
}
const initialize = async (
  service: WebAuthnAuthenticationServiceParams,
  authenticator: AttestationAuthenticator | AssertionAuthenticator
): Promise<boolean> => {
  try {
    const {
      storeService,
      localStorageService,
      webAuthnAuthenticationEncryptorService,
    } = service;
    const state = storeService.getState();
    const login = userLoginSelector(state);
    const rememberMPCipheringKeyArrayBuffer = await generate64BytesKey();
    const rememberMPCipheringKeyB64 = bufferToBase64(
      rememberMPCipheringKeyArrayBuffer
    );
    const rememberMpCipheringKeyRaw = atob(rememberMPCipheringKeyB64);
    const response = await completeRememberMeRegistration(storeService, login, {
      masterPasswordEncryptionKey: rememberMPCipheringKeyB64,
      authenticator,
    });
    if (isApiError(response)) {
      throw new Error(response.code);
    }
    const sessionKeysStored = {
      accessKey: response.sessionAccessKey,
      secretKey: response.sessionSecretKey,
      expirationTimeSeconds: response.sessionExpirationDateUnix,
    };
    storeService.dispatch(loadSessionKeys(sessionKeysStored));
    await localStorageService
      .getInstance()
      .storeAuthenticationKeys(sessionKeysStored);
    const emptyServerKey = "";
    const cryptoConfig = getNoDerivationCryptoConfig();
    webAuthnAuthenticationEncryptorService.setInstance(
      { raw: rememberMpCipheringKeyRaw },
      emptyServerKey,
      cryptoConfig
    );
    const masterPasswordClearRaw = masterPasswordSelector(state);
    await localStorageService
      .getInstance()
      .storeWebAuthnMasterPassword(masterPasswordClearRaw);
    await persistLocalAccountRememberMeType(storeService, "webauthn");
    storeService.dispatch(setRememberMeTypeAction("webauthn"));
    return true;
  } catch (error) {
    const message = `[WebAuthnAuthentication] - initialize: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    logError(augmentedError);
    return false;
  }
};
export const shouldTrigger = async (
  storeService: StoreService,
  storageService: StorageService,
  localStorageService: LocalStorageService,
  sessionClient: SessionClient,
  login: string
): Promise<boolean> => {
  try {
    localStorageService.setInstance(login);
    if (isAuthenticatedSelector(storeService.getState())) {
      return false;
    }
    if (!(await hasSessionKeysInStorage(localStorageService))) {
      return false;
    }
    await loadSessionKeysToStore(
      storeService,
      storageService,
      localStorageService,
      sessionClient
    );
    const sessionKeys = sessionKeysSelector(storeService.getState());
    if (!areSessionKeysValid(sessionKeys)) {
      return false;
    }
    return localStorageService.getInstance().doesMasterPasswordExist();
  } catch (error) {
    if (error.message !== RememberMeErrorCode.EMPTY_SESSION_KEYS) {
      const message = `[WebAuthnAuthentication] - shouldTrigger: ${error}`;
      const augmentedError = new Error(message);
      sendExceptionLog({ error: augmentedError });
      logError(augmentedError);
    }
    return false;
  }
};
const process = async (
  service: WebAuthnAuthenticationServiceParams,
  login: string,
  authenticator: AssertionAuthenticator
): Promise<void> => {
  try {
    const {
      storeService,
      webAuthnAuthenticationEncryptorService,
      localStorageService,
    } = service;
    const result = await completeRememberMeOpenSession(storeService, login, {
      authenticator,
    });
    if (isApiError(result)) {
      throw new Error(result.message);
    }
    const emptyServerKey = "";
    const cryptoConfig = getNoDerivationCryptoConfig();
    const rememberMPCipheringKeyB64 = result.masterPasswordEncryptionKey;
    const rememberMpCipheringKeyRaw = atob(rememberMPCipheringKeyB64);
    webAuthnAuthenticationEncryptorService.setInstance(
      { raw: rememberMpCipheringKeyRaw },
      emptyServerKey,
      cryptoConfig
    );
    const masterPasswordClearRaw = await localStorageService
      .getInstance()
      .getWebAuthnMasterPassword();
    storeService.dispatch(updateMasterPassword(masterPasswordClearRaw));
  } catch (error) {
    const message = `[WebAuthnAuthentication] - processWebAuthnAuthentication: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    logError(augmentedError);
  }
};
const deactivate = async (
  service: WebAuthnAuthenticationServiceParams,
  login: string
): Promise<boolean> => {
  const { storeService, localStorageService, sessionClient } = service;
  const deviceAccessKeys = await getDeviceAccessKeysFromSession(
    sessionClient,
    login
  );
  if (!deviceAccessKeys) {
    return false;
  }
  const result = await deactivateRememberMe(storeService, login, {
    deviceAccessKey: deviceAccessKeys,
  });
  if (isApiError(result)) {
    return false;
  }
  await localStorageService.getInstance().cleanAuthenticationKey();
  await persistLocalAccountRememberMeType(storeService, "disabled");
  storeService.dispatch(setRememberMeTypeAction("disabled"));
  return true;
};
export const makeWebAuthnAuthenticationService = (
  options: WebAuthnAuthenticationServiceParams
): WebAuthnAuthenticationService => {
  return {
    initialize: (
      authenticator: AttestationAuthenticator | AssertionAuthenticator
    ) => initialize(options, authenticator),
    process: (login: string, authenticator: AssertionAuthenticator) =>
      process(options, login, authenticator),
    shouldTrigger: (login: string) =>
      shouldTrigger(
        options.storeService,
        options.storageService,
        options.localStorageService,
        options.sessionClient,
        login
      ),
    deactivate: (login: string) => deactivate(options, login),
  };
};
