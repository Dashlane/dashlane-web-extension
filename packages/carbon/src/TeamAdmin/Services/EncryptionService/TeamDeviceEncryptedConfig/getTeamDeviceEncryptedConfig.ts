import {
  AuthenticationCode,
  GetTeamDeviceEncryptedConfigRequest,
  GetTeamDeviceEncryptedConfigResult,
  TeamDeviceConfigParameters,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { deflatedUtf8ToUtf16 } from "Libs/CryptoCenter";
import {
  BasicConfigNotFound,
  getCode,
  getTeamDeviceEncryptedConfig as getTeamDeviceEncryptedConfigApi,
  getTeamDeviceEncryptedConfigErrors,
  isApiError,
  TeamDeviceEncryptedConfigNotFound,
  UnknownError,
} from "Libs/DashlaneApi";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { userLoginSelector } from "Session/selectors";
import { requireAdmin } from "../requireAdmin";
import { getEncryptionServiceConfig } from "TeamAdmin/Services/EncryptionService/EncryptionServiceConfig/getEncryptionServiceConfig";
import { mapTeamDeviceEncryptedConfig } from "./generateTeamDeviceEncryptedConfig";
export const getParsedTeamDeviceEncryptedConfig = async (
  services: CoreServices,
  {
    configEncryptionKey,
    encryptedConfig,
  }: {
    configEncryptionKey: string;
    encryptedConfig: string;
  }
): Promise<TeamDeviceConfigParameters> => {
  if (!encryptedConfig || !configEncryptionKey) {
    throw new Error("missing config or encryption key");
  }
  const { teamDeviceEncryptedConfigEncryptorService } = services;
  const emptyServerKey = "";
  const cryptoConfig = getNoDerivationCryptoConfig();
  teamDeviceEncryptedConfigEncryptorService.setInstance(
    { raw: atob(configEncryptionKey) },
    emptyServerKey,
    cryptoConfig
  );
  const bytes = await teamDeviceEncryptedConfigEncryptorService
    .getInstance()
    .decrypt(encryptedConfig);
  const decryptedConfig = deflatedUtf8ToUtf16(bytes, {
    skipInflate: true,
  });
  return mapTeamDeviceEncryptedConfig(decryptedConfig);
};
export async function getTeamDeviceEncryptedConfig(
  services: CoreServices,
  { deviceAccessKey, draft }: GetTeamDeviceEncryptedConfigRequest
): Promise<GetTeamDeviceEncryptedConfigResult> {
  const { storeService } = services;
  requireAdmin(storeService);
  const login = userLoginSelector(storeService.getState());
  if (!login) {
    throw new Error(AuthenticationCode[AuthenticationCode.USER_UNAUTHORIZED]);
  }
  const basicConfigResponse = await getEncryptionServiceConfig(services);
  if (basicConfigResponse.success === false) {
    return {
      success: false,
      error: {
        code:
          basicConfigResponse.error.code === BasicConfigNotFound
            ? TeamDeviceEncryptedConfigNotFound
            : UnknownError,
      },
    };
  }
  const {
    data: { deviceAccessKey: existingDeviceAccessKey, configEncryptionKey },
  } = basicConfigResponse;
  const getConfigParams = {
    configurationVersion: 0,
    deviceAccessKey: deviceAccessKey || existingDeviceAccessKey,
    draft,
  };
  try {
    const encryptedConfigResponse = await getTeamDeviceEncryptedConfigApi(
      storeService,
      login,
      getConfigParams
    );
    if (isApiError(encryptedConfigResponse)) {
      return {
        success: false,
        error: {
          code: getCode(
            encryptedConfigResponse.code,
            getTeamDeviceEncryptedConfigErrors
          ),
        },
      };
    }
    const configProperties = await getParsedTeamDeviceEncryptedConfig(
      services,
      {
        encryptedConfig: encryptedConfigResponse.encryptedConfiguration,
        configEncryptionKey,
      }
    );
    return {
      success: true,
      data: {
        config: encryptedConfigResponse.encryptedConfiguration,
        configurationVersion: encryptedConfigResponse.configurationVersion,
        deviceAccessKey,
        encryptionKeyUuid: encryptedConfigResponse.encryptionKeyUuid,
        configProperties,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: {
        code: TeamDeviceEncryptedConfigNotFound,
      },
    };
  }
}
