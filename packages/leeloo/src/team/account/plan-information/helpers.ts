import { intervalToDuration } from "date-fns";
import { B2BStatus } from "@dashlane/communication";
import {
  GetTeamTrialStatusResult,
  SpaceTier,
} from "@dashlane/team-admin-contracts";
import { DiscontinuedStatusLoaded } from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { TranslatorInterface } from "../../../libs/i18n/types";
export const OPEN_ADD_SEATS_DIALOG_QUERY = "showSeatsDialog";
export const NUMBER_OF_SEATS_TO_BUY_QUERY = "seatsToBuy";
export const getRemainingPlanDuration = (nextBillingUnix: Date) => {
  const duration = intervalToDuration({
    start: Date.now(),
    end: nextBillingUnix,
  });
  return {
    days: duration.days,
    months: duration.months,
    years: duration.years,
  };
};
export type SubscriptionPhases =
  | "TRIAL"
  | "GRACE PERIOD"
  | "DISCONTINUED TRIAL"
  | "ACTIVE"
  | "ACTIVE CANCELED"
  | "ACTIVE CARD EXPIRED"
  | "DISCONTINUED CANCELED"
  | "DISCONTINUED CARD EXPIRED";
export const getSubscriptionPhase = (
  discontinuedStatus: DiscontinuedStatusLoaded,
  b2BStatus: B2BStatus,
  trialStatus: GetTeamTrialStatusResult,
  isPaymentCardExpired: boolean
): SubscriptionPhases => {
  const { isTeamSoftDiscontinued, isTrial } = discontinuedStatus;
  if (isTeamSoftDiscontinued && isTrial) {
    return "DISCONTINUED TRIAL";
  } else if (trialStatus.isFreeTrial && !trialStatus.isGracePeriod) {
    return "TRIAL";
  } else if (trialStatus.isGracePeriod) {
    return "GRACE PERIOD";
  } else if (
    b2BStatus.currentTeam?.isRenewalStopped &&
    !isTeamSoftDiscontinued
  ) {
    return "ACTIVE CANCELED";
  } else if (
    b2BStatus.currentTeam?.isRenewalStopped &&
    isTeamSoftDiscontinued
  ) {
    return "DISCONTINUED CANCELED";
  } else if (
    isPaymentCardExpired &&
    !isTeamSoftDiscontinued &&
    !b2BStatus.currentTeam?.isRenewalStopped
  ) {
    return "ACTIVE CARD EXPIRED";
  } else if (
    isPaymentCardExpired &&
    isTeamSoftDiscontinued &&
    !b2BStatus.currentTeam?.isRenewalStopped
  ) {
    return "DISCONTINUED CARD EXPIRED";
  }
  return "ACTIVE";
};
const PLAN_NAME_KEYS = {
  TEAM: "team_account_teamplan_team",
  BUSINESS: "team_account_teamplan_business",
  BUSINESSPLUS: "team_account_teamplan_business_plus",
  STARTER: "team_account_teamplan_changeplan_plans_starter_name",
  STANDARD: "team_account_teamplan_standard",
};
export const getTranslatedB2BPlanName = (
  planTier: SpaceTier,
  translate: TranslatorInterface
) => {
  if (planTier === SpaceTier.Team) {
    return `Dashlane ${translate(PLAN_NAME_KEYS.TEAM)}`;
  } else if (planTier === SpaceTier.Starter) {
    return `Dashlane ${translate(PLAN_NAME_KEYS.STARTER)}`;
  } else if (planTier === SpaceTier.Standard) {
    return `Dashlane ${translate(PLAN_NAME_KEYS.STANDARD)}`;
  } else if (planTier === SpaceTier.BusinessPlus) {
    return `Dashlane ${translate(PLAN_NAME_KEYS.BUSINESSPLUS)}`;
  }
  return `Dashlane ${translate(PLAN_NAME_KEYS.BUSINESS)}`;
};
export const getNumberOfPreFilledSeatsToBuy = (search: string) => {
  const searchParamNumberOfSeatsToBuy =
    new URLSearchParams(search).get(NUMBER_OF_SEATS_TO_BUY_QUERY) ?? "";
  let prefilledNumberOfSeatsToBuy: number | undefined = parseInt(
    searchParamNumberOfSeatsToBuy,
    10
  );
  if (isNaN(prefilledNumberOfSeatsToBuy)) {
    prefilledNumberOfSeatsToBuy = undefined;
  }
  return prefilledNumberOfSeatsToBuy;
};
