import { differenceInCalendarDays, fromUnixTime } from "date-fns";
import {
  CarbonEndpointResult,
  DataStatus,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { NodePremiumStatus, SpaceTier } from "@dashlane/communication";
import { carbonConnector } from "../connector";
const FREE_TRIAL_PLAN_NAME = "free_trial_30d";
export type DiscontinuedStatusLoaded = {
  isLoading: false;
  planFeature: SpaceTier | undefined;
  planCopy: string | undefined;
  isTeamSoftDiscontinued: boolean | undefined;
  isTrial: boolean | undefined;
  isBillingOrFullAdmin: boolean | undefined;
};
export type UseDiscontinuedStatusOutput =
  | {
      isLoading: true;
    }
  | DiscontinuedStatusLoaded;
export type IsFreeB2CUser =
  | {
      isLoading: true;
      isFreeB2C: null;
      isFreeB2CInPostTrial: null;
    }
  | {
      isLoading: false;
      isFreeB2C: boolean;
      isFreeB2CInPostTrial: boolean;
    };
export function useNodePremiumStatus(): CarbonEndpointResult<NodePremiumStatus> {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getNodePremiumStatus,
      },
    },
    []
  );
}
export function useDiscontinuedStatus(): UseDiscontinuedStatusOutput {
  const nodePremiumStatusData = useNodePremiumStatus();
  if (nodePremiumStatusData.status === DataStatus.Loading) {
    return { isLoading: true };
  }
  if (nodePremiumStatusData.status === DataStatus.Error) {
    return {
      isLoading: false,
      planFeature: undefined,
      planCopy: undefined,
      isTeamSoftDiscontinued: undefined,
      isTrial: undefined,
      isBillingOrFullAdmin: undefined,
    };
  }
  const currentTeam = nodePremiumStatusData.data.b2bStatus?.currentTeam;
  const planFeature = currentTeam?.planFeature;
  const isBillingOrFullAdmin = currentTeam?.teamMembership
    ? currentTeam.teamMembership.isBillingAdmin ||
      currentTeam.teamMembership.isTeamAdmin
    : undefined;
  const planCopy = planFeature
    ? planFeature === "team"
      ? "team_account_teamplan_team"
      : "team_account_teamplan_business"
    : undefined;
  const isTeamSoftDiscontinued = currentTeam?.isSoftDiscontinued;
  const isTrial = currentTeam?.isTrial;
  return {
    isLoading: false,
    planFeature,
    planCopy,
    isTeamSoftDiscontinued,
    isTrial,
    isBillingOrFullAdmin,
  };
}
export function useIsFreeB2CUser(): IsFreeB2CUser {
  const nodePremiumStatus = useNodePremiumStatus();
  if (nodePremiumStatus.status !== DataStatus.Success) {
    return { isLoading: true, isFreeB2C: null, isFreeB2CInPostTrial: null };
  }
  const isFreeB2C =
    nodePremiumStatus.data.statusCode === 0 &&
    Object.keys(nodePremiumStatus.data.b2bStatus ?? {}).length === 0 &&
    !nodePremiumStatus.data.isTrial;
  const expiredDate = nodePremiumStatus.data.previousPlan?.endDateUnix ?? 0;
  const daysAfterTrial =
    expiredDate > 0
      ? Math.abs(
          differenceInCalendarDays(fromUnixTime(expiredDate), new Date())
        )
      : expiredDate;
  const isFreeB2CInPostTrial =
    isFreeB2C &&
    !nodePremiumStatus.data.isPaid &&
    nodePremiumStatus.data.previousPlan?.planName === FREE_TRIAL_PLAN_NAME &&
    daysAfterTrial >= 0 &&
    daysAfterTrial <= 15;
  return {
    isLoading: false,
    isFreeB2C,
    isFreeB2CInPostTrial,
  };
}
