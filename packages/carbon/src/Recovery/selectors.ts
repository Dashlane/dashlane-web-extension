import { State } from "Store/types";
import { isRecoveryEnabledSelector } from "Team/selectors";
import { isSSOUserSelector } from "Session/sso.selectors";
import {
  personalSettingsSelector,
  premiumStatusSelector,
} from "Session/selectors";
import { getCurrentTeamId } from "Store/helpers/spaceData/index";
import { AdminData } from "@dashlane/communication";
import { createSelector } from "reselect";
type TeamId = string;
export type TeamAdminData = {
  teams: Record<TeamId, AdminData>;
};
export const shouldShowFeatureActivationModalSelector = createSelector(
  [
    isSSOUserSelector,
    isRecoveryEnabledSelector,
    (state: State) =>
      typeof state.userSession.personalSettings.RecoveryOptIn === "boolean",
    (state: State) =>
      state.userSession.session.isFirstSessionAfterAccountCreation,
  ],
  (
    isSSOUser,
    isFeatureOptInForTeam,
    featureIsOptInOrOutByUser,
    isAccountCreation
  ) => {
    return (
      !isSSOUser &&
      isFeatureOptInForTeam &&
      !featureIsOptInOrOutByUser &&
      !isAccountCreation
    );
  }
);
export const recoveryHashFromPersonalSettingsSelector = (
  state: State
): string => {
  const personalSettings = personalSettingsSelector(state);
  return personalSettings.RecoveryHash || "";
};
export const recoveryHashFromPremiumStatusSelector = (state: State): string => {
  const premiumStatus = premiumStatusSelector(state);
  return premiumStatus.recoveryHash || "";
};
export const selectTeamAdminData = (state: State): TeamAdminData => {
  return state.userSession.teamAdminData ?? { teams: {} };
};
export const accountRecoveryRequestsCountSelector = (state: State): number => {
  const teamId = getCurrentTeamId(state.userSession.spaceData);
  if (!teamId) {
    return 0;
  }
  const { teams } = selectTeamAdminData(state);
  return Number(
    teams[teamId]?.notifications?.accountRecoveryRequests?.length ?? 0
  );
};
