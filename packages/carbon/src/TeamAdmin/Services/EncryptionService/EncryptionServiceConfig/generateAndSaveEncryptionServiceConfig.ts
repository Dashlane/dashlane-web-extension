import {
  BasicConfig,
  EncryptionServiceDeploymentLocation,
  GenerateAndSaveEncryptionServiceConfigRequest,
  GenerateAndSaveEncryptionServiceConfigResult,
  UpdateTeamDeviceEncryptedConfigRequest,
} from "@dashlane/communication";
import { bufferToBase64 } from "Libs/CryptoCenter/Helpers/Helper";
import { generate64BytesKey } from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import { InvalidRequestError } from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { requireAdmin } from "../requireAdmin";
import {
  createAwsLinuxEncryptionServiceConfig,
  createAzureEncryptionServiceConfig,
} from "./configScript";
import { getEncryptionServiceConfig } from "./getEncryptionServiceConfig";
import { persistEncryptionServiceConfig } from "./persistEncryptionServiceConfig";
import {
  generateDeviceKeyPair,
  registerTeamDeviceAccount,
  reregisterTeamDevice,
} from "./teamDeviceHelpers";
import { v4 as uuidv4 } from "uuid";
import { updateTeamDeviceEncryptedConfig } from "../TeamDeviceEncryptedConfig/updateTeamDeviceEncryptedConfig";
import { getUnixTime } from "date-fns";
const generateUuidKeyPair = async (): Promise<{
  key: string;
  encryptionKeyUuid: string;
}> => {
  const key = await generate64BytesKey();
  const keyInBase64 = bufferToBase64(key);
  return {
    encryptionKeyUuid: uuidv4().toLowerCase(),
    key: keyInBase64,
  };
};
const generateAndSaveBasicConfig = async (
  services: CoreServices,
  deploymentLocation: EncryptionServiceDeploymentLocation,
  encryptionServiceEndpoint: string,
  updateUserParams: Partial<UpdateTeamDeviceEncryptedConfigRequest> = {},
  existingConfig?: BasicConfig
): Promise<GenerateAndSaveEncryptionServiceConfigResult> => {
  const { deviceSecretKey, deviceAccessKey, teamUuid } =
    await reregisterTeamDevice(services, existingConfig);
  const { devicePrivateKey, devicePublicKey } = await generateDeviceKeyPair(
    services
  );
  const teamDeviceAccountResponse = await registerTeamDeviceAccount(services, {
    deviceAccessKey,
    devicePublicKey,
    devicePrivateKey,
  });
  if (teamDeviceAccountResponse.success === false) {
    return {
      success: false,
      error: teamDeviceAccountResponse.error,
    };
  }
  const { encryptionKeyUuid, key: configEncryptionKey } =
    await generateUuidKeyPair();
  const configGenerator =
    deploymentLocation === "Microsoft Azure"
      ? createAzureEncryptionServiceConfig
      : createAwsLinuxEncryptionServiceConfig;
  const config = configGenerator({
    deviceSecretKey,
    deviceAccessKey,
    teamUuid,
    configEncryptionKey: `${encryptionKeyUuid}|${configEncryptionKey}`,
    encryptionServiceEndpoint,
  });
  const lastGeneratedTimeStamp: number = getUnixTime(Date.now());
  const newBasicConfig = {
    config,
    configEncryptionKey,
    teamUuid,
    deviceAccessKey,
    deviceSecretKey,
    encryptionKeyUuid,
    deploymentLocation,
    devicePublicKey,
    devicePrivateKey,
    lastGeneratedTimeStamp,
  };
  const updateTeamDeviceEncryptedConfigResult =
    await updateTeamDeviceEncryptedConfig(
      services,
      {
        teamDeviceUrl: encryptionServiceEndpoint,
        ...updateUserParams,
      },
      newBasicConfig
    );
  if (updateTeamDeviceEncryptedConfigResult.success === false) {
    return {
      success: false,
      error: updateTeamDeviceEncryptedConfigResult.error,
    };
  }
  const persistResult = await persistEncryptionServiceConfig(
    services,
    newBasicConfig
  );
  if (persistResult.success === false) {
    return {
      success: false,
      error: persistResult.error,
    };
  }
  return {
    success: true,
    data: {
      basicConfig: {
        ...newBasicConfig,
      },
      encryptionServiceReloadingStatus:
        updateTeamDeviceEncryptedConfigResult.data
          .encryptionServiceReloadingStatus,
    },
  };
};
const validDeploymentLocations: EncryptionServiceDeploymentLocation[] = [
  "AWS",
  "Microsoft Azure",
];
export async function generateAndSaveEncryptionServiceConfig(
  services: CoreServices,
  {
    deploymentLocation,
    encryptionServiceEndpoint,
    updateTeamDeviceConfigParams = {},
  }: GenerateAndSaveEncryptionServiceConfigRequest
): Promise<GenerateAndSaveEncryptionServiceConfigResult> {
  const { storeService } = services;
  requireAdmin(storeService);
  if (!validDeploymentLocations.includes(deploymentLocation)) {
    return {
      success: false,
      error: {
        code: InvalidRequestError,
      },
    };
  }
  const existingConfigsResult = await getEncryptionServiceConfig(services);
  let basicConfigResponse;
  if (existingConfigsResult.success) {
    basicConfigResponse = await generateAndSaveBasicConfig(
      services,
      deploymentLocation,
      encryptionServiceEndpoint,
      updateTeamDeviceConfigParams,
      existingConfigsResult.data
    );
  } else {
    basicConfigResponse = await generateAndSaveBasicConfig(
      services,
      deploymentLocation,
      encryptionServiceEndpoint,
      updateTeamDeviceConfigParams
    );
  }
  return basicConfigResponse;
}
