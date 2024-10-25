import {
  ChangeInviteLinkTeamKeyRequest,
  ChangeInviteLinkTeamKeyResult,
  ClearSelfHostedESSettingsResult,
  CompleteTeamDomainResult,
  CreateConfigRequest,
  CreateConfigResult,
  CreateInviteLinkRequest,
  CreateInviteLinkResult,
  DeactivateTeamDeviceRequest,
  DeactivateTeamDeviceResult,
  DeactivateTeamDomainRequest,
  DeactivateTeamDomainResult,
  GenerateAndSaveEncryptionServiceConfigRequest,
  GenerateAndSaveEncryptionServiceConfigResult,
  GetEncryptionServiceConfigResult,
  GetInviteLinkForAdminRequest,
  GetInviteLinkForAdminResult,
  GetInviteLinkRequest,
  GetInviteLinkResult,
  GetLastADSyncDateResult,
  GetRecoveryCodesAsTeamCaptainRequest,
  GetRecoveryCodesAsTeamCaptainResult,
  GetSpecialUserGroupInviteValuesRequest,
  GetSpecialUserGroupInviteValuesResult,
  GetSpecialUserGroupRevisionRequest,
  GetSpecialUserGroupRevisionResult,
  GetTeamDeviceEncryptedConfigRequest,
  GetTeamDeviceEncryptedConfigResult,
  GetTeamDeviceRequest,
  GetTeamDeviceResult,
  GetTeamDomainsResult,
  ListTeamDevicesResult,
  ParseMetadataFieldsRequest,
  ParseMetadataFieldsResult,
  PersistAdminProvisioningKeyRequest,
  PersistAdminProvisioningKeyResult,
  PersistMassDeploymentTeamKeyRequest,
  PersistMassDeploymentTeamKeyResult,
  RegisterTeamDeviceAccountRequest,
  RegisterTeamDeviceAccountResult,
  RegisterTeamDeviceRequest,
  RegisterTeamDeviceResult,
  RegisterTeamDomainRequest,
  RegisterTeamDomainResult,
  RemoveAdminProvisioningKeyResult,
  RequestInviteLinkTokenRequest,
  RequestInviteLinkTokenResult,
  ToggleInviteLinkRequest,
  ToggleInviteLinkResult,
  UpdateTeamDeviceEncryptedConfigRequest,
  UpdateTeamDeviceEncryptedConfigResult,
  UpdateTeamSettingsRequest,
  UpdateTeamSettingsResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type TeamAdminCommands = {
  registerTeamDomain: Command<
    RegisterTeamDomainRequest,
    RegisterTeamDomainResult
  >;
  completeTeamDomainRegistration: Command<void, CompleteTeamDomainResult>;
  deactivateTeamDomain: Command<
    DeactivateTeamDomainRequest,
    DeactivateTeamDomainResult
  >;
  getTeamDomains: Command<void, GetTeamDomainsResult>;
  getTeamDevice: Command<GetTeamDeviceRequest, GetTeamDeviceResult>;
  listTeamDevices: Command<void, ListTeamDevicesResult>;
  deactivateTeamDevice: Command<
    DeactivateTeamDeviceRequest,
    DeactivateTeamDeviceResult
  >;
  registerTeamDevice: Command<
    RegisterTeamDeviceRequest,
    RegisterTeamDeviceResult
  >;
  registerTeamDeviceAccount: Command<
    RegisterTeamDeviceAccountRequest,
    RegisterTeamDeviceAccountResult
  >;
  getEncryptionServiceConfig: Command<void, GetEncryptionServiceConfigResult>;
  generateAndSaveEncryptionServiceConfig: Command<
    GenerateAndSaveEncryptionServiceConfigRequest,
    GenerateAndSaveEncryptionServiceConfigResult
  >;
  clearSelfHostedESSettings: Command<void, ClearSelfHostedESSettingsResult>;
  getTeamDeviceEncryptedConfig: Command<
    GetTeamDeviceEncryptedConfigRequest,
    GetTeamDeviceEncryptedConfigResult
  >;
  updateTeamDeviceEncryptedConfig: Command<
    UpdateTeamDeviceEncryptedConfigRequest,
    UpdateTeamDeviceEncryptedConfigResult
  >;
  updateTeamSettings: Command<
    UpdateTeamSettingsRequest,
    UpdateTeamSettingsResult
  >;
  parseMetadataFields: Command<
    ParseMetadataFieldsRequest,
    ParseMetadataFieldsResult
  >;
  persistAdminProvisioningKey: Command<
    PersistAdminProvisioningKeyRequest,
    PersistAdminProvisioningKeyResult
  >;
  persistMassDeploymentTeamKey: Command<
    PersistMassDeploymentTeamKeyRequest,
    PersistMassDeploymentTeamKeyResult
  >;
  removeAdminProvisioningKey: Command<void, RemoveAdminProvisioningKeyResult>;
  createSSOConnectorConfig: Command<CreateConfigRequest, CreateConfigResult>;
  generateSSOConnectorKey: Command<void, string>;
  getRecoveryCodesAsTeamCaptain: Command<
    GetRecoveryCodesAsTeamCaptainRequest,
    GetRecoveryCodesAsTeamCaptainResult
  >;
  createInviteLink: Command<CreateInviteLinkRequest, CreateInviteLinkResult>;
  changeInviteLinkTeamKey: Command<
    ChangeInviteLinkTeamKeyRequest,
    ChangeInviteLinkTeamKeyResult
  >;
  toggleInviteLink: Command<ToggleInviteLinkRequest, ToggleInviteLinkResult>;
  getInviteLink: Command<GetInviteLinkRequest, GetInviteLinkResult>;
  requestInviteLinkToken: Command<
    RequestInviteLinkTokenRequest,
    RequestInviteLinkTokenResult
  >;
  getInviteLinkForAdmin: Command<
    GetInviteLinkForAdminRequest,
    GetInviteLinkForAdminResult
  >;
  getLastADSyncDate: Command<void, GetLastADSyncDateResult>;
  getSpecialUserGroupInviteValuesForMemberInTeam: Command<
    GetSpecialUserGroupInviteValuesRequest,
    GetSpecialUserGroupInviteValuesResult
  >;
  getSpecialUserGroupRevision: Command<
    GetSpecialUserGroupRevisionRequest,
    GetSpecialUserGroupRevisionResult
  >;
};
