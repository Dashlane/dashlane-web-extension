import {
  AccountCreationCode,
  CheckLoginResponse,
  ConfirmAccountCreationRequest,
  ConfirmAccountCreationResult,
  CreateAccountRequest,
  CreateAccountResult,
} from "@dashlane/communication";
import { sendExceptionLog } from "Logs/Exception";
import * as settingsService from "Account/Creation/services/SettingsService";
import * as createAccountService from "Account/Creation/services";
import { makeCryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import {
  accountCreationStarted,
  AccountKeyState,
  saveAccountKeys,
  saveAccountSettings,
  SettingsState,
} from "Session/Store/account-creation/actions";
import { generateRsaKeys } from "User/Services/UserSessionService";
import { CoreServices } from "Services/index";
import { storeSSOSettings } from "Session/Store/ssoSettings/actions";
import { triggerServiceProviderUrlRedirect } from "Login/SSO/utils";
import Debugger from "Logs/Debugger";
import { parsePayload } from "Libs/CryptoCenter/transportable-data";
import { base64ToBuffer } from "Libs/CryptoCenter/Helpers/Helper";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import {
  AccountExistsStatus,
  isApiError,
  requestAccountCreation,
} from "Libs/DashlaneApi";
import { StoreService } from "Store";
export interface AccountCreationController {
  checkLogin: (login: string) => Promise<CheckLoginResponse>;
  createAccount: (params: CreateAccountRequest) => Promise<CreateAccountResult>;
  confirmAccountCreation: (
    encryptSettingsResult: ConfirmAccountCreationRequest
  ) => Promise<ConfirmAccountCreationResult>;
}
const ACCOUNT_CREATION_LOGIN_REGEXP =
  /^[a-zA-Z0-9_.+@'\-{}]{5,128}.[A-Za-z]{2,24}$/;
export function validateLoginForAccountCreation(login: string) {
  return ACCOUNT_CREATION_LOGIN_REGEXP.test(login);
}
export async function checkLogin(
  storeService: StoreService,
  login: string
): Promise<CheckLoginResponse> {
  Debugger.log("AccountCreationController.checkLogin");
  const errorCodes = {
    SSO_BLOCKED: "SSO_BLOCKED",
  };
  if (!validateLoginForAccountCreation(login)) {
    return {
      accountCreationCode: AccountCreationCode.USER_DOESNT_EXIST_INVALID_MX,
    };
  }
  const response = await requestAccountCreation(storeService, { login });
  if (isApiError(response)) {
    if (response.code === errorCodes.SSO_BLOCKED) {
      return {
        accountCreationCode:
          AccountCreationCode.USER_DOESNT_EXIST_SSO_NON_PROVISIONED,
      };
    }
    throw new Error(
      `[AccountCreationController] - checkLogin: ${response.message} (${response.code})`
    );
  }
  if (response.ssoServiceProviderUrl) {
    storeService.dispatch(
      storeSSOSettings({
        serviceProviderUrl: response.ssoServiceProviderUrl,
        isNitroProvider: response.ssoIsNitroProvider,
      })
    );
    if (response.ssoIsNitroProvider) {
      return {
        accountCreationCode: AccountCreationCode.USER_NITRO_SSO_PROVISIONED,
        isProposedExpired: response.isProposedExpired,
        isUserProposed: response.isProposed,
        isUserAccepted: response.isAccepted,
      };
    }
    triggerServiceProviderUrlRedirect(storeService.getState(), login);
    return {
      accountCreationCode: AccountCreationCode.USER_SSO_PROVISIONED,
      isProposedExpired: response.isProposedExpired,
      isUserProposed: response.isProposed,
      isUserAccepted: response.isAccepted,
    };
  }
  switch (response.exists) {
    case AccountExistsStatus.AccountExists:
      return {
        accountCreationCode: AccountCreationCode.USER_EXISTS,
        isProposedExpired: response.isProposedExpired,
        isUserProposed: response.isProposed,
        isUserAccepted: response.isAccepted,
      };
    case AccountExistsStatus.AccountDoesntExistInvalid:
      return {
        accountCreationCode: AccountCreationCode.USER_DOESNT_EXIST_INVALID_MX,
        isProposedExpired: response.isProposedExpired,
        isUserProposed: response.isProposed,
        isUserAccepted: response.isAccepted,
      };
    case AccountExistsStatus.AccountDoesntExistUnlikely:
      return {
        accountCreationCode: AccountCreationCode.USER_DOESNT_EXIST_UNLIKELY_MX,
        isProposedExpired: response.isProposedExpired,
        isUserProposed: response.isProposed,
        isUserAccepted: response.isAccepted,
      };
    case AccountExistsStatus.AccountDoesntExist:
    default:
      return {
        accountCreationCode: AccountCreationCode.USER_DOESNT_EXIST,
        isProposedExpired: response.isProposedExpired,
        isUserProposed: response.isProposed,
        isUserAccepted: response.isAccepted,
      };
  }
}
export function encryptSettings(
  storeService: StoreService,
  dataEncryptorService: DataEncryptorService,
  params: CreateAccountRequest
): Promise<CreateAccountResult> {
  return Promise.resolve()
    .then(() => {
      const store = storeService.getStore();
      const settingsState: SettingsState = settingsService.encryptSettings(
        storeService,
        dataEncryptorService,
        params
      );
      store.dispatch(saveAccountSettings(settingsState));
      const cryptoService = makeCryptoService();
      const encryptOptions = {
        cryptoConfig: parsePayload(
          settingsState.personalSettings.CryptoUserPayload
        ).cryptoConfig,
        forceSalt: base64ToBuffer(
          settingsState.personalSettings.CryptoFixedSalt
        ),
      };
      const accountKeyState: AccountKeyState = {
        promise: generateRsaKeys(
          dataEncryptorService,
          cryptoService,
          encryptOptions
        ),
      };
      storeService.dispatch(saveAccountKeys(accountKeyState));
      const encryptSettingsResult = {
        encryptSettingsRequest: params,
        valid: true,
      };
      return encryptSettingsResult;
    })
    .catch((error: Error) => {
      const message = `[AccountCreation] - encryptSettings: ${error}`;
      const augmentedError = new Error(message);
      Debugger.error(augmentedError);
      sendExceptionLog({ error: augmentedError });
      throw augmentedError;
    });
}
function confirmAccountCreation(
  services: CoreServices,
  encryptSettingsResult: ConfirmAccountCreationRequest
): Promise<ConfirmAccountCreationResult> {
  return Promise.resolve()
    .then(() => {
      const store = services.storeService.getStore();
      const personalSettings =
        store.getState().userSession.accountCreation.settings.personalSettings;
      const accountCreationState = services.storeService.getAccountCreation();
      const settingsPromise = accountCreationState.settings.promise;
      if (settingsPromise === null) {
        throw new Error(
          "createAccount should be call before confirmAccountCreation"
        );
      }
      const accountKeyPromise = accountCreationState.accountKey.promise;
      if (accountKeyPromise === null) {
        throw new Error(
          "createAccount should be call before confirmAccountCreation"
        );
      }
      return createAccountService.createAccount(
        services,
        encryptSettingsResult,
        settingsPromise,
        personalSettings,
        accountKeyPromise
      );
    })
    .catch((error: Error) => {
      const message = `[AccountCreation] - confirmAccountCreation: ${error}`;
      const augmentedError = new Error(message);
      Debugger.error(augmentedError);
      sendExceptionLog({ error: augmentedError });
      throw augmentedError;
    });
}
export function makeAccountCreationController(
  services: CoreServices
): AccountCreationController {
  return {
    checkLogin: (login) => {
      return checkLogin(services.storeService, login);
    },
    createAccount: (params) => {
      services.storeService.dispatch(accountCreationStarted({ isSSO: false }));
      return services.sessionService.close(false).then(() => {
        services.masterPasswordEncryptorService.setInstance(
          { raw: params.password },
          ""
        );
        const { storeService, masterPasswordEncryptorService } = services;
        return encryptSettings(
          storeService,
          masterPasswordEncryptorService,
          params
        );
      });
    },
    confirmAccountCreation: (encryptSettingsResult) => {
      return confirmAccountCreation(services, encryptSettingsResult);
    },
  };
}
