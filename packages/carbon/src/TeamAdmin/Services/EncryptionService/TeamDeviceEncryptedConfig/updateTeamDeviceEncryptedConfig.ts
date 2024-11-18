import {
  BasicConfig,
  TeamDeviceConfigParameters,
  UpdateTeamDeviceEncryptedConfigRequest,
  UpdateTeamDeviceEncryptedConfigResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  DeviceKeyNotFound,
  getCode,
  isApiError,
  TeamDeviceEncryptedConfigNotFound,
  UnknownError,
  updateTeamDeviceEncryptedConfig as updateTeamDeviceEncryptedConfigApi,
  updateTeamDeviceEncryptedConfigErrors,
} from "Libs/DashlaneApi";
import { utf16ToDeflatedUtf8 } from "Libs/CryptoCenter";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { makeSharingService } from "Sharing/2/Services";
import { getCurrentUserInfo } from "Session/utils";
import { userLoginSelector } from "Session/selectors";
import { setTeamSettings } from "Team/SettingsController";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
import { getEncryptionServiceConfig } from "TeamAdmin/Services/EncryptionService/EncryptionServiceConfig/getEncryptionServiceConfig";
import { parseMetadataFields } from "TeamAdmin/Services/SamlMetadataParser/samlMetadataParser";
import { generateSSOConnectorKey } from "TeamAdmin/Services/SSOConnector/generateSSOConnectorKey";
import { persistSSOConnectorKey } from "TeamAdmin/Services/EncryptionService/ssoConnectorKey/persistSSOConnectorKey";
import { persistSCIMSignatureKey } from "TeamAdmin/Services/EncryptionService/scimSignatureKey/persistSCIMSignatureKey";
import { removeTeamAdminItem } from "TeamAdmin/remove-team-admin-item";
import { requireAdmin } from "../requireAdmin";
import {
  getParsedTeamDeviceEncryptedConfig,
  getTeamDeviceEncryptedConfig,
} from "./getTeamDeviceEncryptedConfig";
import { generateTeamDeviceEncryptedConfig } from "./generateTeamDeviceEncryptedConfig";
import { generateSCIMSignatureKey } from "../scimSignatureKey/generateSCIMSignatureKey";
import { getTeamInfo } from "Team/Services/teamSettingsServices";
export const updateTeamDeviceEncryptedConfig = async (
  services: CoreServices,
  userParams: Partial<UpdateTeamDeviceEncryptedConfigRequest> = {},
  newBasicConfig?: BasicConfig
): Promise<UpdateTeamDeviceEncryptedConfigResult> => {
  const {
    storeService,
    teamDeviceEncryptedConfigEncryptorService: encryptorService,
    wsService,
  } = services;
  requireAdmin(storeService);
  const login = userLoginSelector(storeService.getState());
  if (!login) {
    throw new Error("missing login");
  }
  const currentSsoSettings = {
    ssoEnabled: false,
    ssoIdpMetaData: "",
    ssoEndpoint: "",
  };
  const teamInfoResult = await getTeamInfo(services);
  if (teamInfoResult.success) {
    currentSsoSettings.ssoEnabled = teamInfoResult.data.teamInfo.ssoEnabled;
    currentSsoSettings.ssoIdpMetaData =
      teamInfoResult.data.teamInfo.ssoIdpMetadata;
    currentSsoSettings.ssoEndpoint =
      teamInfoResult.data.teamInfo.ssoServiceProviderUrl;
  }
  const teamId = parseInt(currentTeamIdSelector(storeService.getState()), 10);
  let samlIdpCertificate: string | null = null;
  let samlIdpEntryPoint: string | null = null;
  if (currentSsoSettings.ssoIdpMetaData) {
    ({ samlIdpCertificate, samlIdpEntryPoint } = await parseMetadataFields(
      currentSsoSettings.ssoIdpMetaData
    ));
  }
  if (typeof userParams.ssoIdpMetadata === "string") {
    const { ssoIdpMetadata } = userParams;
    if (ssoIdpMetadata) {
      try {
        ({ samlIdpCertificate, samlIdpEntryPoint } = await parseMetadataFields(
          ssoIdpMetadata
        ));
      } catch (e) {
        return {
          success: false,
          error: {
            code: UnknownError,
          },
        };
      }
    }
    const teamSettingsResponse = await setTeamSettings(
      storeService,
      wsService,
      getCurrentUserInfo(storeService),
      {
        teamId,
        settings: {
          ssoIdpMetadata: ssoIdpMetadata || null,
          ssoIdpEntrypoint: samlIdpEntryPoint,
        },
      }
    );
    if (teamSettingsResponse.error) {
      return {
        success: false,
        error: { code: UnknownError },
      };
    }
  }
  const basicConfigResponse = await getEncryptionServiceConfig(services);
  const configToUse = newBasicConfig
    ? newBasicConfig
    : basicConfigResponse.success &&
      basicConfigResponse.data.deviceAccessKey &&
      basicConfigResponse.data.configEncryptionKey &&
      basicConfigResponse.data.encryptionKeyUuid &&
      basicConfigResponse.data.devicePrivateKey &&
      basicConfigResponse.data.devicePublicKey
    ? basicConfigResponse.data
    : null;
  if (!configToUse) {
    return {
      success: false,
      error: {
        code: DeviceKeyNotFound,
      },
    };
  }
  const {
    deviceAccessKey,
    encryptionKeyUuid: configEncryptionKeyUuid,
    configEncryptionKey,
    devicePrivateKey: teamDevicePrivateKey,
    devicePublicKey: teamDevicePublicKey,
  } = configToUse;
  const encryptionKeyUuid = configEncryptionKeyUuid.toLowerCase();
  const existingTeamConfig = await getTeamDeviceEncryptedConfig(services, {
    draft: false,
    deviceAccessKey: deviceAccessKey,
  });
  let persistedConfigParams: Partial<TeamDeviceConfigParameters> = {};
  let existingConfigVersion = 0;
  if (
    existingTeamConfig.success === false &&
    existingTeamConfig.error.code !== TeamDeviceEncryptedConfigNotFound
  ) {
    return {
      success: false,
      error: {
        code: UnknownError,
      },
    };
  } else if (existingTeamConfig.success === true) {
    const { data: configData } = existingTeamConfig;
    persistedConfigParams = await getParsedTeamDeviceEncryptedConfig(services, {
      encryptedConfig: configData.config,
      configEncryptionKey,
    });
    existingConfigVersion = configData.configurationVersion;
  }
  const sharingService = makeSharingService(storeService, wsService);
  const currentTeamId = currentTeamIdSelector(storeService.getState());
  const adminData = adminDataForTeamSelector(
    storeService.getState(),
    currentTeamId
  );
  let connectorKey = adminData?.ssoConnectorKey?.ssoConnectorKey;
  if (!connectorKey || userParams.ssoConnectorKey) {
    try {
      if (connectorKey && userParams.ssoConnectorKey) {
        await removeTeamAdminItem(services, "ssoConnectorKey");
      }
      const generatedConnectorKey =
        userParams.ssoConnectorKey ?? (await generateSSOConnectorKey());
      connectorKey = await persistSSOConnectorKey(
        services,
        sharingService,
        generatedConnectorKey
      );
    } catch (e) {
      return {
        success: false,
        error: {
          code: UnknownError,
        },
      };
    }
  }
  let signatureKey = adminData?.scimSignatureKey?.scimSignatureKey;
  if (!signatureKey) {
    const generatedSignatureKey = await generateSCIMSignatureKey();
    signatureKey = await persistSCIMSignatureKey(
      services,
      sharingService,
      generatedSignatureKey
    );
  }
  const mergedParamsPartial = {
    scimAuthToken:
      userParams?.scimAuthToken ?? persistedConfigParams?.scimAuthToken ?? "",
    scimEnabled:
      userParams?.scimEnabled ?? persistedConfigParams?.scimEnabled ?? false,
    connectorEndpoint:
      userParams?.connectorEndpoint ??
      persistedConfigParams?.connectorEndpoint ??
      currentSsoSettings.ssoEndpoint ??
      "",
    samlIdpEntryPoint:
      samlIdpEntryPoint ?? persistedConfigParams?.samlIdpEntryPoint ?? "",
    samlIdpCertificate:
      samlIdpCertificate ?? persistedConfigParams?.samlIdpCertificate ?? "",
  };
  const inferredSsoEnabled = Boolean(
    userParams.ssoEnabled ||
      persistedConfigParams.connectorKey ||
      currentSsoSettings.ssoEnabled
  );
  const newConfig: TeamDeviceConfigParameters = {
    ...mergedParamsPartial,
    teamDevicePrivateKey,
    teamDevicePublicKey,
    connectorKey: inferredSsoEnabled ? connectorKey : "",
    scimSignatureKey: mergedParamsPartial.scimEnabled ? signatureKey : "",
  };
  const rawConfig = generateTeamDeviceEncryptedConfig(newConfig);
  const bytes = utf16ToDeflatedUtf8(rawConfig, {
    skipUtf8Encoding: true,
    skipDeflate: true,
  });
  const emptyServerKey = "";
  const cryptoConfig = getNoDerivationCryptoConfig();
  encryptorService.setInstance(
    { raw: atob(configEncryptionKey) },
    emptyServerKey,
    cryptoConfig
  );
  const encryptorInstance = encryptorService.getInstance();
  const encryptedConfiguration = await encryptorInstance.encrypt(bytes);
  const apiParameters = {
    configurationVersion: existingConfigVersion,
    deviceAccessKey,
    ssoServiceEnabled: inferredSsoEnabled,
    scimServiceEnabled: newConfig.scimEnabled,
    encryptionKeyUuid,
    draft: false,
    encryptedConfiguration,
    teamDeviceUrl: userParams.teamDeviceUrl,
  };
  const updateConfigResult = await updateTeamDeviceEncryptedConfigApi(
    storeService,
    login,
    apiParameters
  );
  if (isApiError(updateConfigResult)) {
    return {
      success: false,
      error: {
        code: getCode(
          updateConfigResult.code,
          updateTeamDeviceEncryptedConfigErrors
        ),
      },
    };
  }
  return {
    success: true,
    data: {
      configurationVersion: updateConfigResult.configurationVersion,
      encryptionServiceReloadingStatus:
        updateConfigResult.encryptionServiceReloadingStatus,
    },
  };
};
