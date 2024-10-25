import {
  AdminItem,
  MassDeploymentTeamKeyItem,
} from "Session/Store/teamAdminData/types";
export const isMassDeploymentTeamKey = (
  adminItem: AdminItem
): adminItem is MassDeploymentTeamKeyItem =>
  "massDeploymentTeamAccessKey" in adminItem &&
  "massDeploymentTeamSecretKey" in adminItem;
