import { MassDeploymentTeamKeyData } from "@dashlane/communication";
import { State } from "Store";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
export const massDeploymentTeamKeySelector = (
  state: State
): MassDeploymentTeamKeyData => {
  const currentTeamId = currentTeamIdSelector(state);
  const adminData = adminDataForTeamSelector(state, currentTeamId);
  return {
    massDeploymentTeamAccessKey:
      adminData.massDeploymentTeamKey?.massDeploymentTeamAccessKey ?? null,
    massDeploymentTeamSecretKey:
      adminData.massDeploymentTeamKey?.massDeploymentTeamSecretKey ?? null,
  };
};
