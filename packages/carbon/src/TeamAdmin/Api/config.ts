import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { TeamAdminCommands } from "TeamAdmin/Api/commands";
import { TeamAdminQueries } from "TeamAdmin/Api/queries";
import { TeamAdminLiveQueries } from "TeamAdmin/Api/live-queries";
import {
  administrableUserGroupSelector,
  administrableUserGroupsSelector,
  isGroupNameAvailableSelector,
} from "TeamAdmin/Services/selectors";
import {
  administrableUserGroup$,
  administrableUserGroups$,
  adminProvisioningKey$,
} from "TeamAdmin/Services/live";
import { completeTeamDomainRegistration } from "TeamAdmin/Services/Domain/completeTeamDomainRegistration";
import { deactivateTeamDomain } from "TeamAdmin/Services/Domain/deactivateTeamDomain";
import { registerTeamDomain } from "TeamAdmin/Services/Domain/registerTeamDomain";
import { getTeamDomains } from "TeamAdmin/Services/Domain/getTeamDomains";
import { getTeamDevice } from "TeamAdmin/Services/Device/getTeamDevice";
import { listTeamDevices } from "TeamAdmin/Services/Device/listTeamDevices";
import { deactivateTeamDevice } from "TeamAdmin/Services/Device/deactivateTeamDevice";
import { registerTeamDevice } from "TeamAdmin/Services/Device/registerTeamDevice";
import { createSSOConnectorConfig } from "TeamAdmin/Services/SSOConnector/createSSOConnectorConfig";
import { generateSSOConnectorKey } from "TeamAdmin/Services/SSOConnector/generateSSOConnectorKey";
import { getEncryptionServiceConfig } from "TeamAdmin/Services/EncryptionService/EncryptionServiceConfig/getEncryptionServiceConfig";
import { generateAndSaveEncryptionServiceConfig } from "TeamAdmin/Services/EncryptionService/EncryptionServiceConfig/generateAndSaveEncryptionServiceConfig";
import { clearSelfHostedESSettings } from "../Services/EncryptionService/clear-self-hosted-es-settings";
import { getTeamDeviceEncryptedConfig } from "TeamAdmin/Services/EncryptionService/TeamDeviceEncryptedConfig/getTeamDeviceEncryptedConfig";
import { registerTeamDeviceAccount } from "TeamAdmin/Services/EncryptionService/EncryptionServiceConfig/teamDeviceHelpers";
import { updateTeamDeviceEncryptedConfig } from "TeamAdmin/Services/EncryptionService/TeamDeviceEncryptedConfig/updateTeamDeviceEncryptedConfig";
import { parseMetadataFieldsHandler as parseMetadataFields } from "TeamAdmin/Services/SamlMetadataParser/samlMetadataParser";
import { persistAdminProvisioningKey } from "TeamAdmin/Services/EncryptionService/adminProvisioningKey/persistAdminProvisioningKey";
import { adminProvisioningKeySelector } from "TeamAdmin/Services/EncryptionService/adminProvisioningKey/adminProvisioningKeySelector";
import { removeAdminProvisioningKey } from "TeamAdmin/Services/EncryptionService/adminProvisioningKey/remove-admin-provisioning-key";
import { massDeploymentTeamKey$ } from "TeamAdmin/Services/LoggedOutMonitoring";
import { persistMassDeploymentTeamKey } from "TeamAdmin/Services/LoggedOutMonitoring/persistMassDeploymentTeamKey.command-handler";
import { massDeploymentTeamKeySelector } from "TeamAdmin/Services/LoggedOutMonitoring/selectors";
import { getRecoveryCodesAsTeamCaptain } from "TeamAdmin/Services/member/getRecoveryCodesAsTeamCaptain";
import { updateTeamSettings } from "TeamAdmin/Services/Settings/updateTeamSettings";
import { getInviteLink } from "TeamAdmin/Services/InviteLink/get-invite-link";
import { getInviteLinkForAdmin } from "TeamAdmin/Services/InviteLink/get-invite-link-for-admin";
import { changeInviteLinkTeamKey } from "TeamAdmin/Services/InviteLink/change-invite-link-team-key";
import { createInviteLink } from "TeamAdmin/Services/InviteLink/create-invite-link";
import { toggleInviteLink } from "TeamAdmin/Services/InviteLink/toggle-invite-link";
import { getLastADSyncDate } from "TeamAdmin/Services/DirectorySync/getLastADSyncDate";
import {
  getSpecialUserGroupInviteValuesForMemberInTeam,
  getSpecialUserGroupRevision,
} from "TeamAdmin/Services/TeamAdminManagementService";
import { requestInviteLinkToken } from "TeamAdmin/Services/InviteLink/request-invite-link-token";
export const config: CommandQueryBusConfig<
  TeamAdminCommands,
  TeamAdminQueries,
  TeamAdminLiveQueries
> = {
  commands: {
    completeTeamDomainRegistration: {
      handler: completeTeamDomainRegistration,
    },
    deactivateTeamDomain: { handler: deactivateTeamDomain },
    getTeamDomains: { handler: getTeamDomains },
    getTeamDevice: { handler: getTeamDevice },
    listTeamDevices: { handler: listTeamDevices },
    deactivateTeamDevice: { handler: deactivateTeamDevice },
    registerTeamDomain: { handler: registerTeamDomain },
    registerTeamDevice: { handler: registerTeamDevice },
    registerTeamDeviceAccount: { handler: registerTeamDeviceAccount },
    getEncryptionServiceConfig: {
      handler: getEncryptionServiceConfig,
    },
    generateAndSaveEncryptionServiceConfig: {
      handler: generateAndSaveEncryptionServiceConfig,
    },
    clearSelfHostedESSettings: {
      handler: clearSelfHostedESSettings,
    },
    getTeamDeviceEncryptedConfig: {
      handler: getTeamDeviceEncryptedConfig,
    },
    updateTeamDeviceEncryptedConfig: {
      handler: updateTeamDeviceEncryptedConfig,
    },
    updateTeamSettings: {
      handler: updateTeamSettings,
    },
    parseMetadataFields: {
      handler: parseMetadataFields,
    },
    persistAdminProvisioningKey: {
      handler: persistAdminProvisioningKey,
    },
    removeAdminProvisioningKey: {
      handler: removeAdminProvisioningKey,
    },
    persistMassDeploymentTeamKey: {
      handler: persistMassDeploymentTeamKey,
    },
    createSSOConnectorConfig: { handler: createSSOConnectorConfig },
    generateSSOConnectorKey: { handler: generateSSOConnectorKey },
    getRecoveryCodesAsTeamCaptain: {
      handler: getRecoveryCodesAsTeamCaptain,
    },
    getInviteLink: {
      handler: getInviteLink,
    },
    requestInviteLinkToken: {
      handler: requestInviteLinkToken,
    },
    getInviteLinkForAdmin: {
      handler: getInviteLinkForAdmin,
    },
    changeInviteLinkTeamKey: {
      handler: changeInviteLinkTeamKey,
    },
    createInviteLink: {
      handler: createInviteLink,
    },
    toggleInviteLink: {
      handler: toggleInviteLink,
    },
    getLastADSyncDate: {
      handler: getLastADSyncDate,
    },
    getSpecialUserGroupInviteValuesForMemberInTeam: {
      handler: getSpecialUserGroupInviteValuesForMemberInTeam,
    },
    getSpecialUserGroupRevision: {
      handler: getSpecialUserGroupRevision,
    },
  },
  queries: {
    getAdministrableUserGroup: { selector: administrableUserGroupSelector },
    getAdministrableUserGroups: {
      selector: administrableUserGroupsSelector,
    },
    isGroupNameAvailable: { selector: isGroupNameAvailableSelector },
    getAdminProvisioningKey: {
      selector: adminProvisioningKeySelector,
    },
    getMassDeploymentTeamKey: {
      selector: massDeploymentTeamKeySelector,
    },
  },
  liveQueries: {
    liveAdministrableUserGroup: { operator: administrableUserGroup$ },
    liveAdministrableUserGroups: { operator: administrableUserGroups$ },
    liveAdminProvisioningKey: { operator: adminProvisioningKey$ },
    liveMassDeploymentTeamKey: { operator: massDeploymentTeamKey$ },
  },
};
