import * as sr from "@dashlane/sharing/types/serverResponse";
import {
  AdminProvisioningKeyData,
  MassDeploymentTeamKeyData,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type TeamAdminQueries = {
  getAdministrableUserGroup: Query<string, sr.UserGroupDownload | undefined>;
  getAdministrableUserGroups: Query<void, sr.UserGroupDownload[]>;
  isGroupNameAvailable: Query<string, boolean>;
  getAdminProvisioningKey: Query<void, AdminProvisioningKeyData>;
  getMassDeploymentTeamKey: Query<void, MassDeploymentTeamKeyData>;
};
