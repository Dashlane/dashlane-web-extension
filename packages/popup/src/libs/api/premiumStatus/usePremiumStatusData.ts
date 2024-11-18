import {
  CarbonQueryResult,
  DataStatus,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { NodePremiumStatus, PremiumStatus } from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
export type DiscontinuedStatusLoaded = {
  isLoading: false;
  isTeamSoftDiscontinued: boolean | undefined;
  isTrial: boolean | undefined;
  isBillingOrFullAdmin: boolean | undefined;
};
export type UseDiscontinuedStatusOutput =
  | {
      isLoading: true;
    }
  | DiscontinuedStatusLoaded;
export function usePremiumStatusData(): CarbonQueryResult<PremiumStatus> {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getPremiumStatus,
      },
      liveConfig: {
        live: carbonConnector.livePremiumStatus,
      },
    },
    []
  );
}
export function usePremiumStatus(): PremiumStatus | null {
  const premiumStatusCodeData = usePremiumStatusData();
  return premiumStatusCodeData.status === DataStatus.Success
    ? premiumStatusCodeData.data
    : null;
}
export function useNodePremiumStatus(): NodePremiumStatus | null {
  const nodePremiumStatusData = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getNodePremiumStatus,
      },
    },
    []
  );
  return nodePremiumStatusData.status === DataStatus.Success
    ? nodePremiumStatusData.data
    : null;
}
export function useDiscontinuedStatus(): UseDiscontinuedStatusOutput {
  const nodePremiumStatusData = useNodePremiumStatus();
  if (!nodePremiumStatusData) {
    return { isLoading: true };
  }
  const currentTeam = nodePremiumStatusData.b2bStatus?.currentTeam;
  const isBillingOrFullAdmin = currentTeam?.teamMembership
    ? currentTeam.teamMembership.isBillingAdmin ||
      currentTeam.teamMembership.isTeamAdmin
    : undefined;
  const isTeamSoftDiscontinued = currentTeam?.isSoftDiscontinued;
  const isTrial = currentTeam?.isTrial;
  return {
    isLoading: false,
    isTeamSoftDiscontinued,
    isTrial,
    isBillingOrFullAdmin,
  };
}
