import { GlobalState } from "../../../store/types";
import { TeamAdminData } from "../types";
export const selectTeamAdminData = (
  globalState: GlobalState
): TeamAdminData => {
  return globalState.carbon.teamAdminData ?? { teams: {} };
};
