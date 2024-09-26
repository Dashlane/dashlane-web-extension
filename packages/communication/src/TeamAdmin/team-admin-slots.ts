import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  DeactivateTeamDeviceRequest,
  DeactivateTeamDeviceResult,
  GetTeamDeviceRequest,
  GetTeamDeviceResult,
  ListTeamDevicesResult,
  RegisterTeamDeviceRequest,
  RegisterTeamDeviceResult,
} from "./device-types";
import { GetLastADSyncDateResult } from "./directory-sync";
import {
  CompleteTeamDomainResult,
  DeactivateTeamDomainRequest,
  DeactivateTeamDomainResult,
  GetTeamDomainsResult,
  RegisterTeamDomainRequest,
  RegisterTeamDomainResult,
} from "./domain-types";
import {
  ClearSelfHostedESSettingsResult,
  GenerateAndSaveEncryptionServiceConfigRequest,
  GenerateAndSaveEncryptionServiceConfigResult,
  GetEncryptionServiceConfigResult,
  GetTeamDeviceEncryptedConfigRequest,
  GetTeamDeviceEncryptedConfigResult,
  PersistAdminProvisioningKeyRequest,
  PersistAdminProvisioningKeyResult,
  RegisterTeamDeviceAccountRequest,
  RegisterTeamDeviceAccountResult,
  RemoveAdminProvisioningKeyResult,
  UpdateTeamDeviceEncryptedConfigRequest,
  UpdateTeamDeviceEncryptedConfigResult,
} from "./encryption-service-types";
import {
  ChangeInviteLinkTeamKeyRequest,
  ChangeInviteLinkTeamKeyResult,
  CreateInviteLinkRequest,
  CreateInviteLinkResult,
  GetInviteLinkForAdminRequest,
  GetInviteLinkForAdminResult,
  GetInviteLinkRequest,
  GetInviteLinkResult,
  RequestInviteLinkTokenRequest,
  RequestInviteLinkTokenResult,
  ToggleInviteLinkRequest,
  ToggleInviteLinkResult,
} from "./invite-link-types";
import {
  GetRecoveryCodesAsTeamCaptainRequest,
  GetRecoveryCodesAsTeamCaptainResult,
} from "./member-types";
import {
  ParseMetadataFieldsRequest,
  ParseMetadataFieldsResult,
} from "./saml-metadata-parser-types";
import { CreateConfigRequest, CreateConfigResult } from "./sso-connector-types";
import {
  UpdateTeamSettingsRequest,
  UpdateTeamSettingsResult,
} from "./team-settings-types";
import {
  AdminProvisioningKeyData,
  GetSpecialUserGroupInviteValuesRequest,
  GetSpecialUserGroupInviteValuesResult,
  GetSpecialUserGroupRevisionRequest,
  GetSpecialUserGroupRevisionResult,
  MassDeploymentTeamKeyData,
} from "./types";
import {
  PersistMassDeploymentTeamKeyRequest,
  PersistMassDeploymentTeamKeyResult,
} from "./mass-deployment-types";
export const teamAdminQueriesSlots = {
  getAdministrableUserGroup: slot<string, UserGroupDownload | undefined>(),
  getAdministrableUserGroups: slot<void, UserGroupDownload[]>(),
  isGroupNameAvailable: slot<string, boolean>(),
  getAdminProvisioningKey: slot<void, AdminProvisioningKeyData>(),
  getMassDeploymentTeamKey: slot<void, MassDeploymentTeamKeyData>(),
};
export const teamAdminLiveQueriesSlots = {
  liveAdministrableUserGroup: liveSlot<UserGroupDownload | undefined>(),
  liveAdministrableUserGroups: liveSlot<UserGroupDownload[]>(),
  liveAdminProvisioningKey: liveSlot<AdminProvisioningKeyData>(),
  liveMassDeploymentTeamKey: liveSlot<MassDeploymentTeamKeyData>(),
};
export const teamAdminCommandsSlots = {
  registerTeamDomain: slot<
    RegisterTeamDomainRequest,
    RegisterTeamDomainResult
  >(),
  completeTeamDomainRegistration: slot<void, CompleteTeamDomainResult>(),
  deactivateTeamDomain: slot<
    DeactivateTeamDomainRequest,
    DeactivateTeamDomainResult
  >(),
  getTeamDomains: slot<void, GetTeamDomainsResult>(),
  getTeamDevice: slot<GetTeamDeviceRequest, GetTeamDeviceResult>(),
  listTeamDevices: slot<void, ListTeamDevicesResult>(),
  deactivateTeamDevice: slot<
    DeactivateTeamDeviceRequest,
    DeactivateTeamDeviceResult
  >(),
  registerTeamDevice: slot<
    RegisterTeamDeviceRequest,
    RegisterTeamDeviceResult
  >(),
  registerTeamDeviceAccount: slot<
    RegisterTeamDeviceAccountRequest,
    RegisterTeamDeviceAccountResult
  >(),
  getEncryptionServiceConfig: slot<void, GetEncryptionServiceConfigResult>(),
  generateAndSaveEncryptionServiceConfig: slot<
    GenerateAndSaveEncryptionServiceConfigRequest,
    GenerateAndSaveEncryptionServiceConfigResult
  >(),
  clearSelfHostedESSettings: slot<void, ClearSelfHostedESSettingsResult>(),
  getTeamDeviceEncryptedConfig: slot<
    GetTeamDeviceEncryptedConfigRequest,
    GetTeamDeviceEncryptedConfigResult
  >(),
  updateTeamDeviceEncryptedConfig: slot<
    UpdateTeamDeviceEncryptedConfigRequest,
    UpdateTeamDeviceEncryptedConfigResult
  >(),
  updateTeamSettings: slot<
    UpdateTeamSettingsRequest,
    UpdateTeamSettingsResult
  >(),
  parseMetadataFields: slot<
    ParseMetadataFieldsRequest,
    ParseMetadataFieldsResult
  >(),
  persistAdminProvisioningKey: slot<
    PersistAdminProvisioningKeyRequest,
    PersistAdminProvisioningKeyResult
  >(),
  persistMassDeploymentTeamKey: slot<
    PersistMassDeploymentTeamKeyRequest,
    PersistMassDeploymentTeamKeyResult
  >(),
  removeAdminProvisioningKey: slot<void, RemoveAdminProvisioningKeyResult>(),
  createSSOConnectorConfig: slot<CreateConfigRequest, CreateConfigResult>(),
  generateSSOConnectorKey: slot<void, string>(),
  getRecoveryCodesAsTeamCaptain: slot<
    GetRecoveryCodesAsTeamCaptainRequest,
    GetRecoveryCodesAsTeamCaptainResult
  >(),
  createInviteLink: slot<CreateInviteLinkRequest, CreateInviteLinkResult>(),
  changeInviteLinkTeamKey: slot<
    ChangeInviteLinkTeamKeyRequest,
    ChangeInviteLinkTeamKeyResult
  >(),
  toggleInviteLink: slot<ToggleInviteLinkRequest, ToggleInviteLinkResult>(),
  getInviteLink: slot<GetInviteLinkRequest, GetInviteLinkResult>(),
  requestInviteLinkToken: slot<
    RequestInviteLinkTokenRequest,
    RequestInviteLinkTokenResult
  >(),
  getInviteLinkForAdmin: slot<
    GetInviteLinkForAdminRequest,
    GetInviteLinkForAdminResult
  >(),
  getLastADSyncDate: slot<void, GetLastADSyncDateResult>(),
  getSpecialUserGroupInviteValuesForMemberInTeam: slot<
    GetSpecialUserGroupInviteValuesRequest,
    GetSpecialUserGroupInviteValuesResult
  >(),
  getSpecialUserGroupRevision: slot<
    GetSpecialUserGroupRevisionRequest,
    GetSpecialUserGroupRevisionResult
  >(),
};
