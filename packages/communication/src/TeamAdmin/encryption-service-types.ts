import { ValuesType } from "@dashlane/framework-types";
import {
  CreateTeamDeviceAccountError,
  CreateTeamDeviceAccountFailure,
  CreateTeamDeviceAccountSuccess,
  DeactivateTeamDeviceError,
} from "./device-types";
import {
  BasicConfigNotFound,
  DeactivatedTeamDevice,
  DeviceAccountMappingAlreadyExists,
  DeviceKeyNotFound,
  InvalidRequestError,
  InvalidTeamDeviceLogin,
  NotAdmin,
  TeamDeviceEncryptedConfigNotFound,
  UnknownTeamAdminError,
} from "./errors";
export type GetTeamDeviceEncryptedConfigError =
  | typeof TeamDeviceEncryptedConfigNotFound
  | typeof NotAdmin
  | typeof UnknownTeamAdminError;
export type EncryptionServiceDeploymentLocation = "AWS" | "Microsoft Azure";
export interface BasicConfig {
  config?: string;
  deploymentLocation?: EncryptionServiceDeploymentLocation;
  encryptionKeyUuid?: string;
  configEncryptionKey?: string;
  deviceAccessKey?: string;
  deviceSecretKey?: string;
  teamUuid?: string;
  devicePublicKey?: string;
  devicePrivateKey?: string;
  lastGeneratedTimeStamp?: number;
}
export const EncryptionServiceRestartStatusCodes = Object.freeze({
  OK: "OK",
  ES_UNREACHABLE: "ES_UNREACHABLE",
  ES_CONFIG_RELOAD_FAILURE: "ES_CONFIG_RELOAD_FAILURE",
  ES_INTERNAL_NETWORK_ERROR: "ES_INTERNAL_NETWORK_ERROR",
});
export type EncryptionServiceRestartStatusCode = ValuesType<
  typeof EncryptionServiceRestartStatusCodes
>;
export interface GetEncryptionServiceConfigsSuccess {
  success: true;
  data: BasicConfig;
}
export type GetEncryptionServiceError =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError
  | typeof TeamDeviceEncryptedConfigNotFound
  | typeof BasicConfigNotFound;
export interface GetEncryptionServiceConfigsFailure {
  success: false;
  error: {
    code: GetEncryptionServiceError;
  };
}
export type GetEncryptionServiceConfigResult =
  | GetEncryptionServiceConfigsSuccess
  | GetEncryptionServiceConfigsFailure;
export interface GenerateAndSaveEncryptionServiceConfigRequest {
  deploymentLocation: EncryptionServiceDeploymentLocation;
  encryptionServiceEndpoint: string;
  updateTeamDeviceConfigParams: Partial<UpdateTeamDeviceEncryptedConfigRequest>;
}
export type GenerateAndSaveEncryptionServiceConfigsSuccess = {
  success: true;
  data: {
    basicConfig: Required<BasicConfig>;
    encryptionServiceReloadingStatus: EncryptionServiceRestartStatusCode;
  };
};
export type GenerateAndSaveEncryptionServiceConfigsErrors =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError
  | typeof DeviceAccountMappingAlreadyExists
  | typeof DeviceKeyNotFound
  | typeof InvalidRequestError
  | typeof InvalidTeamDeviceLogin;
export type GenerateAndSaveEncryptionServiceConfigFailure =
  | {
      success: false;
      error: {
        code: GenerateAndSaveEncryptionServiceConfigsErrors;
      };
    }
  | UpdateTeamDeviceEncryptedConfigFailure;
export type GenerateAndSaveEncryptionServiceConfigResult =
  | GenerateAndSaveEncryptionServiceConfigsSuccess
  | GenerateAndSaveEncryptionServiceConfigFailure;
export type ClearSelfHostedESSettingsWarning = typeof BasicConfigNotFound;
export interface ClearSelfHostedESSettingsSuccess {
  success: true;
  warnings?: ClearSelfHostedESSettingsWarning[];
}
export type ClearSelfHostedESSettingsError =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError
  | typeof BasicConfigNotFound
  | typeof DeviceKeyNotFound
  | typeof DeactivatedTeamDevice;
export interface ClearSelfHostedESSettingsFailure {
  success: false;
  error: {
    code: ClearSelfHostedESSettingsError;
  };
}
export type ClearSelfHostedESSettingsResult =
  | ClearSelfHostedESSettingsSuccess
  | ClearSelfHostedESSettingsFailure;
export type PersistEncryptionServiceConfigRequest = BasicConfig;
export type PersistEncryptionServiceConfigSuccess = {
  success: true;
  data: BasicConfig;
};
export type PersistEncryptionServiceConfigError =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError;
export type PersistEncryptionServiceConfigFailure = {
  success: false;
  error: {
    code: PersistEncryptionServiceConfigError;
  };
};
export type PersistEncryptionServiceConfigResult =
  | PersistEncryptionServiceConfigSuccess
  | PersistEncryptionServiceConfigFailure;
export type EncryptedSCIMConfigProperties = {
  scimSignatureKey: string;
  scimAuthToken: string;
  scimEnabled: boolean;
  teamDevicePublicKey: string;
  teamDevicePrivateKey: string;
};
type EncryptedSSOConfigProperties = {
  samlIdpCertificate: string;
  samlIdpEntryPoint: string;
  connectorEndpoint: string;
  connectorKey: string;
};
export type TeamDeviceConfigParameters = EncryptedSCIMConfigProperties &
  EncryptedSSOConfigProperties;
export type GetTeamDeviceEncryptedConfigRequest = {
  configurationVersion?: number;
  draft: boolean;
  deviceAccessKey?: string;
};
export type GetTeamDeviceEncryptedConfigSuccess = {
  success: true;
  data: {
    config: string;
    configurationVersion: number;
    deviceAccessKey: string;
    encryptionKeyUuid: string;
    configProperties: UpdateTeamDeviceEncryptedConfigRequest;
  } | null;
};
export type GetTeamDeviceEncryptedConfigFailure = {
  success: false;
  error: {
    code: GetTeamDeviceEncryptedConfigError;
  };
};
export type GetTeamDeviceEncryptedConfigResult =
  | GetTeamDeviceEncryptedConfigSuccess
  | GetTeamDeviceEncryptedConfigFailure;
export type UpdateTeamDeviceEncryptedConfigSuccess = {
  success: true;
  data: {
    configurationVersion: number;
    encryptionServiceReloadingStatus: EncryptionServiceRestartStatusCode;
  };
};
export type UpdateTeamDeviceEncryptedConfigError =
  | typeof NotAdmin
  | typeof UnknownTeamAdminError
  | typeof TeamDeviceEncryptedConfigNotFound
  | typeof DeviceAccountMappingAlreadyExists
  | typeof DeviceKeyNotFound;
export type UpdateTeamDeviceEncryptedConfigFailure = {
  success: false;
  error: {
    code:
      | UpdateTeamDeviceEncryptedConfigError
      | CreateTeamDeviceAccountError
      | DeactivateTeamDeviceError;
  };
};
export type UpdateTeamDeviceEncryptedConfigRequest = Partial<
  Omit<TeamDeviceConfigParameters, "samlIdpCertificate" | "samlIdpEntryPoint">
> & {
  ssoIdpMetadata?: string;
  ssoEnabled?: boolean;
  teamDeviceUrl?: string;
  ssoConnectorKey?: string;
};
export type UpdateTeamDeviceEncryptedConfigResult =
  | UpdateTeamDeviceEncryptedConfigSuccess
  | UpdateTeamDeviceEncryptedConfigFailure;
export interface PersistAdminProvisioningKeyRequest {
  adminProvisioningKey: string;
}
export type PersistAdminProvisioningKeySuccess = {
  success: true;
};
export type PersistAdminProvisioningKeyFailure = {
  success: false;
  error: string;
};
export type PersistAdminProvisioningKeyResult =
  | PersistAdminProvisioningKeySuccess
  | PersistAdminProvisioningKeyFailure;
export type RemoveAdminProvisioningKeySuccess = {
  success: true;
};
export type RemoveAdminProvisioningKeyFailure = {
  success: false;
};
export type RemoveAdminProvisioningKeyResult =
  | RemoveAdminProvisioningKeySuccess
  | RemoveAdminProvisioningKeyFailure;
type RegisterTeamDeviceAccountHasKeyPairPartial = {
  devicePublicKey: string;
  devicePrivateKey: string;
  shouldGenerateDeviceKeyPair?: never;
};
type RegisterTeamDeviceAccountNeedsKeyPairPartial = {
  devicePublicKey?: never;
  devicePrivateKey?: never;
  shouldGenerateDeviceKeyPair: true;
};
export type RegisterTeamDeviceAccountRequest = {
  deviceAccessKey: string;
} & (
  | RegisterTeamDeviceAccountHasKeyPairPartial
  | RegisterTeamDeviceAccountNeedsKeyPairPartial
);
export type RegisterTeamDeviceAccountSuccess =
  CreateTeamDeviceAccountSuccess & {
    data: {
      devicePrivateKey: string;
      devicePublicKey: string;
    };
  };
export type RegisterTeamDeviceAccountFailure = CreateTeamDeviceAccountFailure;
export type RegisterTeamDeviceAccountResult =
  | RegisterTeamDeviceAccountSuccess
  | RegisterTeamDeviceAccountFailure;
