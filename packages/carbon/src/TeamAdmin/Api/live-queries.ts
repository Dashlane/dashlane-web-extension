import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import {
  AdminProvisioningKeyData,
  MassDeploymentTeamKeyData,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type TeamAdminLiveQueries = {
  liveAdministrableUserGroup: LiveQuery<string, UserGroupDownload | undefined>;
  liveAdministrableUserGroups: LiveQuery<void, UserGroupDownload[]>;
  liveAdminProvisioningKey: LiveQuery<void, AdminProvisioningKeyData>;
  liveMassDeploymentTeamKey: LiveQuery<void, MassDeploymentTeamKeyData>;
};
