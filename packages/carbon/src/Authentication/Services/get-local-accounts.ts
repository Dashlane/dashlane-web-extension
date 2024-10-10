import { LocalAccountInfo } from "@dashlane/communication";
import { StoreService } from "Store";
import {
  getUserPublicSetting,
  getUsersWithPublicSettings,
} from "Application/ApplicationSettings";
import { getUserDeviceWasRegisteredWithDeviceKeysSelector } from "Authentication/selectors";
import { StorageService } from "Libs/Storage/types";
import { isDataStored, StoredUserDataType } from "Libs/Storage/User";
import {
  getLocalAccountRememberMeType,
  shouldAskMasterPassword,
} from "Libs/RememberMe/helpers";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
export async function getLocalAccounts(
  storeService: StoreService,
  storageService: StorageService
): Promise<LocalAccountInfo[]> {
  const localAccountLogins = getUsersWithPublicSettings();
  const localAccountValidity = {};
  const mandatoryUserStorageKeys: StoredUserDataType[] = [
    "localSettings",
    "personalData",
    "personalSettings",
  ];
  return Promise.all(
    localAccountLogins.map(async (login) => {
      const userDeviceWasRegisterWithDeviceKeys =
        getUserDeviceWasRegisteredWithDeviceKeysSelector(
          storeService.getState(),
          login
        );
      const authenticationStorageKey: StoredUserDataType[] =
        userDeviceWasRegisterWithDeviceKeys ? ["authentication"] : [];
      const storageKeys = [
        ...mandatoryUserStorageKeys,
        ...authenticationStorageKey,
      ];
      const localDataExist = await Promise.all(
        storageKeys.map((key) => isDataStored(storageService, login, key))
      );
      const localAccountIsValid = localDataExist.every(
        (localDataExist) => localDataExist
      );
      localAccountValidity[login] = localAccountIsValid;
    })
  )
    .then(() =>
      localAccountLogins.filter((login) => localAccountValidity[login])
    )
    .then((validLogins) => {
      const lastUsedAccount = validLogins
        .map((login) => ({
          login,
          lastLoginTime:
            getUserPublicSetting(login, "lastSuccessfulLoginTime") || 0,
        }))
        .sort((a, b) => {
          const aTime = a.lastLoginTime;
          const bTime = b.lastLoginTime;
          if (aTime > bTime) {
            return -1;
          }
          if (aTime < bTime) {
            return 1;
          }
          return 0;
        })[0];
      const accountsInfo = validLogins.map((login) => ({
        login,
        hasLoginOtp: getUserPublicSetting(login, "otp2") || false,
        isLastSuccessfulLogin:
          lastUsedAccount && lastUsedAccount.login === login,
        rememberMeType: getLocalAccountRememberMeType(login) ?? undefined,
        shouldAskMasterPassword: shouldAskMasterPassword(login),
      }));
      return accountsInfo.sort((a, b) => {
        const aLogin = a.login.toLowerCase();
        const bLogin = b.login.toLowerCase();
        return aLogin.localeCompare(bLogin);
      });
    })
    .catch((error) => {
      const message = `get-local-accounts: ${error}`;
      const augmentedError = new Error(message);
      logError({ message, details: { error: augmentedError } });
      sendExceptionLog({ error: augmentedError });
      return [];
    });
}
