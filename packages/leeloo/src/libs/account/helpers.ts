import { differenceInHours } from "date-fns";
import { Plan, PlanBillingPeriod } from "@dashlane/hermes";
import {
  PremiumStatus,
  PremiumStatusCode,
  PremiumStatusSpace,
  PreviousPremiumPlan,
  SpaceStatus,
  SpaceTier,
  SpaceTiers,
} from "@dashlane/communication";
import { TranslatorInterface } from "../i18n/types";
import { assertUnreachable } from "../assert-unreachable";
import { getDaysLeftInTrial } from "../trial/helpers";
const PLAN_NAMES_MAPPING = {
  [SpaceTiers.Legacy]: SpaceTiers.Team,
  [SpaceTiers.Free]: SpaceTiers.Team,
  [SpaceTiers.Entreprise]: SpaceTiers.Team,
};
const I18N_KEYS = {
  STARTER: "leeloo_teamplan_starter",
  BUSINESS: "leeloo_teamplan_business",
  BUSINESS_PLUS: "manage_subscription_plan_name_business_plus",
  TEAM: "leeloo_teamplan_team",
  STANDARD: "manage_subscription_plan_name_standard",
};
export function isAccountBusiness(premiumStatus: PremiumStatus): boolean {
  return (
    premiumStatus &&
    Array.isArray(premiumStatus.spaces) &&
    premiumStatus.spaces.some((space) => space.status === "accepted")
  );
}
export function isAccountTeamTrialBusiness(
  premiumStatus: PremiumStatus
): boolean {
  return (
    isAccountBusiness(premiumStatus) &&
    (premiumStatus.spaces || []).some((space) => space.planType === "teamTrial")
  );
}
export const isAccountBusinessAdmin = (
  premiumStatus: PremiumStatus | null | undefined
): boolean => {
  if (!premiumStatus) {
    return false;
  }
  return (
    isAccountBusiness(premiumStatus) &&
    (premiumStatus.spaces ?? []).some(
      (space) => space.isTeamAdmin || space.isBillingAdmin
    )
  );
};
export const isTeamTier = (premiumStatus: PremiumStatus): boolean =>
  (premiumStatus?.spaces ?? []).some((space) => space.tier === "team");
export const isBusinessTier = (premiumStatus: PremiumStatus): boolean =>
  (premiumStatus?.spaces ?? []).some((space) => space.tier === "business");
export const isStarterTier = (premiumStatus: PremiumStatus): boolean =>
  (premiumStatus?.spaces ?? []).some((space) => space.tier === "starter");
export const isStandardTier = (premiumStatus: PremiumStatus): boolean =>
  (premiumStatus?.spaces ?? []).some((space) => space.tier === "standard");
export function isAccountFamily(premiumStatus: PremiumStatus): boolean {
  return Boolean(premiumStatus?.familyMembership);
}
export function isAccountFamilyAdmin(premiumStatus: PremiumStatus): boolean {
  return Boolean(premiumStatus?.familyMembership?.isAdmin);
}
export function isPaidAccount(
  premiumStatus: PremiumStatus | PreviousPremiumPlan
): boolean {
  return (
    premiumStatus?.statusCode === PremiumStatusCode.PREMIUM ||
    premiumStatus?.statusCode === PremiumStatusCode.PREMIUM_CANCELLED
  );
}
export function isEssentialsPlan(
  premiumStatus: PremiumStatus | PreviousPremiumPlan
): boolean {
  const isPaidAccountEssentials =
    isPaidAccount(premiumStatus) && premiumStatus?.planFeature === "essentials";
  if (premiumStatus.planName) {
    return (
      isPaidAccountEssentials && premiumStatus.planName.includes("essentials")
    );
  } else {
    return isPaidAccountEssentials;
  }
}
export function isAdvancedPlan(
  premiumStatus: PremiumStatus | PreviousPremiumPlan
): boolean {
  if (premiumStatus.planName) {
    return (
      isPaidAccount(premiumStatus) &&
      premiumStatus.planName.includes("advanced")
    );
  }
  return false;
}
export function isFreeTrial(
  premiumStatus: PremiumStatus | PreviousPremiumPlan
): boolean {
  return premiumStatus?.statusCode === PremiumStatusCode.NEW_USER;
}
export function isPremiumPlan(
  premiumStatus: PremiumStatus | PreviousPremiumPlan
): boolean {
  return isPaidAccount(premiumStatus) && premiumStatus?.planFeature === "sync";
}
export function isPremiumPlusPlan(
  premiumStatus: PremiumStatus | PreviousPremiumPlan
): boolean {
  return premiumStatus?.planFeature === "premiumplus";
}
export function getActiveSpace(
  premiumStatus: PremiumStatus
): PremiumStatusSpace | undefined {
  return premiumStatus.spaces?.find(
    (space) => space.status === SpaceStatus.Accepted
  );
}
export function getPlanNameForLogs(premiumStatus: PremiumStatus): Plan {
  if (isAccountFamily(premiumStatus)) {
    return Plan.Family;
  } else if (isEssentialsPlan(premiumStatus)) {
    return Plan.Essentials;
  } else if (isPremiumPlan(premiumStatus)) {
    return Plan.Premium;
  }
  return Plan.Free;
}
export function getPlanNameFromTier(
  tier: SpaceTier
):
  | typeof SpaceTiers.BusinessPlus
  | typeof SpaceTiers.Standard
  | typeof SpaceTiers.Starter
  | typeof SpaceTiers.Team
  | typeof SpaceTiers.Business {
  return PLAN_NAMES_MAPPING[tier] || tier;
}
interface GetLocalizedPlanTierParameters {
  tier: SpaceTier;
  translate: TranslatorInterface;
}
export function getLocalizedPlanTier({
  tier,
  translate,
}: GetLocalizedPlanTierParameters): string {
  const planName = getPlanNameFromTier(tier);
  switch (planName) {
    case SpaceTiers.Standard:
      return translate(I18N_KEYS.STANDARD);
    case SpaceTiers.Starter:
      return translate(I18N_KEYS.STARTER);
    case SpaceTiers.Team:
      return translate(I18N_KEYS.TEAM);
    case SpaceTiers.Business:
      return translate(I18N_KEYS.BUSINESS);
    case SpaceTiers.BusinessPlus:
      return translate(I18N_KEYS.BUSINESS_PLUS);
    default:
      assertUnreachable(planName);
  }
}
export const roundedDaysFromDate = (expirationDate: Date): number => {
  return Math.round(differenceInHours(expirationDate, Date.now()) / 24);
};
export function getPremiumDaysRemaining(
  premiumStatus: PremiumStatus
): number | undefined {
  return premiumStatus &&
    (premiumStatus.planType === "free_trial" ||
      premiumStatus.statusCode === PremiumStatusCode.NEW_USER) &&
    premiumStatus.endDate
    ? getDaysLeftInTrial(premiumStatus.endDate)
    : undefined;
}
export function getPlanBillingPeriod(premiumStatus: PremiumStatus) {
  return premiumStatus?.autoRenewInfo?.periodicity === "monthly"
    ? PlanBillingPeriod.Monthly
    : PlanBillingPeriod.Yearly;
}
