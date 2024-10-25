import { AdminProvisioningKeyData } from "@dashlane/communication";
import { State } from "Store";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
export const adminProvisioningKeySelector = (
  state: State
): AdminProvisioningKeyData => {
  const currentTeamId = currentTeamIdSelector(state);
  const adminData = adminDataForTeamSelector(state, currentTeamId);
  return {
    adminProvisioningKey:
      adminData.adminProvisioningKey?.adminProvisioningKey ?? null,
  };
};
