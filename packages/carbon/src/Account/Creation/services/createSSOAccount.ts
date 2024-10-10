import { v4 as uuidv4 } from "uuid";
import {
  ConfirmAccountCreationRequest,
  CreateAccountRequest,
  Indicator,
  LoginViaSsoCode,
  LoginViaSSOResult,
  UserConsent,
} from "@dashlane/communication";
import { encryptSettings } from "Account/Creation/AccountCreationController";
import { firstSync } from "Account/Creation/services";
import { platformInfoSelector } from "Authentication/selectors";
import { utf16ToDeflatedUtf8 } from "Libs/CryptoCenter";
import {
  arrayBufferToText,
  base64BufferToText,
  base64ToBuffer,
  bufferToBase64,
} from "Libs/CryptoCenter/Helpers/Helper";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { getEncryptionKeyBuffer } from "Libs/CryptoCenter/Helpers/encryptionKeys";
import { generate64BytesKey } from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import {
  ApiError,
  createUserWithSSO,
  CreateUserWithSSOError,
  CreateUserWithSSORequest,
  DomainNotValidForTeam,
  InvalidSsoToken,
  InvalidUser,
  isApiError,
  makeSafeCountry,
  makeSafeLanguage,
  NoFreeSlot,
  NotProposedNeitherAccepted,
  SsoRemoteKey,
} from "Libs/DashlaneApi";
import { sendExceptionLog } from "Logs/Exception";
import { makeReturnErrorObject } from "Login/SSO/utils";
import { CoreServices } from "Services";
import {
  updateAnalyticsIds,
  updateRemoteKey,
} from "Session/Store/session/actions";
import { accountCreationStarted } from "Session/Store/account-creation/actions";
export interface AccountCreationParams {
  consents: UserConsent[];
  anonymousUserId?: string;
  deviceName: string;
  login: string;
  ssoServiceProviderKey: string;
  ssoToken: string;
}
interface PrepareRemoteDataEncryptionServices {
  remoteKey: SsoRemoteKey;
  serverKeyBase64: string;
}
export const prepareRemoteDataEncryptionServices = async (
  services: CoreServices,
  password: string
): Promise<PrepareRemoteDataEncryptionServices> => {
  const remoteKeyUuid = uuidv4();
  const { remoteDataEncryptorService, masterPasswordEncryptorService } =
    services;
  const remoteKeyBuffer = await generate64BytesKey();
  const remoteKeyRaw = base64BufferToText(remoteKeyBuffer);
  const serverKeyBuffer = await generate64BytesKey();
  const serverKeyBase64 = bufferToBase64(serverKeyBuffer);
  const passwordBuffer = base64ToBuffer(password);
  const encryptionKeyBuffer = getEncryptionKeyBuffer(
    passwordBuffer,
    serverKeyBuffer,
    { skipDerivation: true }
  );
  const encryptionKeyRaw = arrayBufferToText(encryptionKeyBuffer);
  const emptyServerKey = "";
  const cryptoConfig = getNoDerivationCryptoConfig();
  masterPasswordEncryptorService.setInstance(
    { raw: encryptionKeyRaw },
    emptyServerKey,
    cryptoConfig
  );
  const bytes = utf16ToDeflatedUtf8(remoteKeyRaw, {
    skipUtf8Encoding: true,
    skipDeflate: true,
  });
  const encryptedRemoteKeyBase64 = await masterPasswordEncryptorService
    .getInstance()
    .encrypt(bytes);
  remoteDataEncryptorService.setInstance(
    { raw: remoteKeyRaw },
    emptyServerKey,
    cryptoConfig
  );
  services.storeService.dispatch(updateRemoteKey(remoteKeyRaw));
  return {
    remoteKey: {
      uuid: remoteKeyUuid,
      key: encryptedRemoteKeyBase64,
      type: "sso",
    },
    serverKeyBase64,
  };
};
export async function createSSOAccount(
  services: CoreServices,
  params: AccountCreationParams
): Promise<LoginViaSSOResult> {
  const { sessionService, storeService, remoteDataEncryptorService } = services;
  const {
    consents,
    deviceName,
    login,
    ssoServiceProviderKey,
    ssoToken,
    anonymousUserId,
  } = params;
  const {
    appVersion,
    country,
    lang,
    platformName: platform,
  } = platformInfoSelector(storeService.getState());
  await sessionService.close(false);
  storeService.dispatch(accountCreationStarted({ isSSO: true }));
  const { remoteKey, serverKeyBase64 } =
    await prepareRemoteDataEncryptionServices(services, ssoServiceProviderKey);
  const subscribe =
    consents.find(({ consentType }) => consentType === "emailsOffersAndTips")
      .status || false;
  const paramsBuild: CreateAccountRequest = {
    anonymousUserId,
    deviceName,
    format: country,
    language: lang,
    login,
    password: ssoServiceProviderKey,
    subscribe,
  };
  await encryptSettings(storeService, remoteDataEncryptorService, paramsBuild);
  const accountCreationState = storeService.getAccountCreation();
  const { content, time } = await accountCreationState.settings.promise;
  const sharingKeys = await accountCreationState.accountKey.promise;
  const osCountry = makeSafeCountry(
    storeService.getLocation().country || country
  );
  if (platform === "server_carbon_unknown") {
    throw new Error("Unexpected uninitialized platform info");
  }
  const userInfo: CreateUserWithSSORequest = {
    login,
    contactEmail: login,
    appVersion,
    sdkVersion: "1.0.0.0",
    platform,
    settings: {
      content,
      time,
    },
    consents,
    deviceName,
    country: osCountry,
    osCountry,
    language: makeSafeLanguage(lang),
    osLanguage: makeSafeLanguage(lang),
    remoteKeys: [remoteKey],
    ssoServerKey: serverKeyBase64,
    ssoToken,
    sharingKeys: {
      publicKey: sharingKeys.keys.publicKey,
      privateKey: sharingKeys.encryptedPrivateKey,
    },
    temporaryDevice: true,
  };
  const response = await createUserWithSSO(storeService, userInfo);
  if (isApiError(response)) {
    return formatError(response);
  }
  const confirmAccountCreationRequest: ConfirmAccountCreationRequest = {
    createAccountResult: {
      encryptSettingsRequest: paramsBuild,
      valid: true,
    },
    options: { flowIndicator: "memberAccount" as Indicator },
    isStandAlone: false,
    consents,
  };
  await firstSync(services, confirmAccountCreationRequest, response, {
    useRemoteKey: true,
  });
  services.storeService.dispatch(
    updateAnalyticsIds(response.userAnalyticsId, response.deviceAnalyticsId)
  );
  return {
    success: true,
    code: LoginViaSsoCode.SUCCESS,
  };
}
const formatError = (error: ApiError<CreateUserWithSSOError>) => {
  const { code, message } = error;
  sendApiErrorLog(code);
  switch (code) {
    case DomainNotValidForTeam:
    case InvalidUser:
    case InvalidSsoToken:
    case NotProposedNeitherAccepted:
    case NoFreeSlot:
      return makeReturnErrorObject(
        LoginViaSsoCode.SSO_VERIFICATION_FAILED,
        message
      );
    default:
      return makeReturnErrorObject(LoginViaSsoCode.UNKNOWN_ERROR, message);
  }
};
const sendApiErrorLog = (code: string) => {
  const message = `[createSSOAccount] - createUserWithSSO: ${code}`;
  const augmentedError = new Error(message);
  sendExceptionLog({ error: augmentedError });
};
