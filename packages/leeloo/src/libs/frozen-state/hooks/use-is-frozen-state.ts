import { useIsB2CUserFrozen } from "./use-is-b2c-user-frozen";
import { useIsTeamDiscontinuedAfterTrial } from "../../hooks/use-is-team-discontinued-after-trial";
export const useIsFrozenState = (): null | boolean => {
  const isAdminDiscontinued = useIsTeamDiscontinuedAfterTrial();
  const isFreeB2CUserFrozen = useIsB2CUserFrozen();
  return isAdminDiscontinued || isFreeB2CUserFrozen;
};
