import { PremiumStatus, SpaceTiers } from "@dashlane/communication";
import {
  getActiveSpace,
  getPlanNameFromTier,
  isAccountBusiness,
  isAccountFamily,
  isAccountFamilyAdmin,
  isAdvancedPlan,
  isEssentialsPlan,
  isFreeTrial,
  isPaidAccount,
  isPremiumPlan,
  isPremiumPlusPlan,
} from "../../../libs/account/helpers";
import { TranslatorInterface } from "../../../libs/i18n/types";
import { LocaleFormat } from "../../../libs/i18n/helpers";
export const getPlanTypes = (premiumStatus: PremiumStatus) => {
  const isPaidAccountUser = isPaidAccount(premiumStatus);
  const isBusinessUser = isAccountBusiness(premiumStatus);
  const isEssentialUser = isEssentialsPlan(premiumStatus);
  const isFamilyAdmin = isAccountFamilyAdmin(premiumStatus);
  const isFamilyUser = isAccountFamily(premiumStatus);
  const isFamilyInvitee = isFamilyUser && !isFamilyAdmin;
  const isPremiumUser = isPremiumPlan(premiumStatus);
  const isPremiumPlusUser =
    isPaidAccountUser && isPremiumPlusPlan(premiumStatus);
  const isFreeTrialUser = isFreeTrial(premiumStatus);
  const isAdvancedUser = isAdvancedPlan(premiumStatus);
  return {
    isPaidAccountUser,
    isBusinessUser,
    isEssentialUser,
    isFamilyAdmin,
    isFamilyUser,
    isFamilyInvitee,
    isPremiumUser,
    isPremiumPlusUser,
    isFreeTrialUser,
    isAdvancedUser,
  };
};
export const isAppStoreUser = (planType: string) => planType?.includes("ios");
export const isGooglePlayUser = (planType: string) =>
  planType?.includes("playstore");
export const I8N_KEYS_PLAN_NAMES = {
  ADVANCED: "manage_subscription_plan_name_advanced",
  BUSINESS: "manage_subscription_plan_name_dashlane_business",
  BUSINESS_PLUS: "manage_subscription_plan_name_dashlane_business_plus",
  ESSENTIALS: "manage_subscription_plan_name_essentials",
  FAMILY: "manage_subscription_plan_name_family",
  FREE: "manage_subscription_plan_name_free",
  PREMIUM: "manage_subscription_plan_name_premium",
  PREMIUM_PLUS: "manage_subscription_plan_name_premium_plus",
  PREMIUM_TRIAL: "manage_subscription_plan_name_premium_trial",
  STANDARD: "manage_subscription_plan_name_dashlane_standard",
  TEAM: "manage_subscription_plan_name_dashlane_team",
};
export const getTranslatedPlanName = (
  premiumStatusData: PremiumStatus,
  translate: TranslatorInterface
): string => {
  const {
    isBusinessUser: isB2BUser,
    isEssentialUser,
    isFamilyUser,
    isPremiumUser,
    isPremiumPlusUser,
    isFreeTrialUser,
    isAdvancedUser,
  } = getPlanTypes(premiumStatusData);
  let planString = "";
  if (isB2BUser) {
    const activeSpace = getActiveSpace(premiumStatusData);
    if (
      activeSpace &&
      getPlanNameFromTier(activeSpace.tier) === SpaceTiers.Team
    ) {
      planString = translate(I8N_KEYS_PLAN_NAMES.TEAM);
    } else {
      planString = translate(I8N_KEYS_PLAN_NAMES.BUSINESS);
    }
  } else if (isFamilyUser) {
    planString = translate(I8N_KEYS_PLAN_NAMES.FAMILY);
  } else if (isAdvancedUser) {
    planString = translate(I8N_KEYS_PLAN_NAMES.ADVANCED);
  } else if (isEssentialUser) {
    planString = translate(I8N_KEYS_PLAN_NAMES.ESSENTIALS);
  } else if (isFreeTrialUser) {
    planString = translate(I8N_KEYS_PLAN_NAMES.PREMIUM_TRIAL);
  } else if (isPremiumPlusUser) {
    planString = translate(I8N_KEYS_PLAN_NAMES.PREMIUM_PLUS);
  } else if (isPremiumUser) {
    planString = translate(I8N_KEYS_PLAN_NAMES.PREMIUM);
  } else {
    planString = translate(I8N_KEYS_PLAN_NAMES.FREE);
  }
  return planString;
};
export const formatRenewalDate = (
  premiumStatusEndDate: number,
  translateFn: TranslatorInterface["shortDate"]
) => {
  const renewalDate = new Date(premiumStatusEndDate * 1000);
  return translateFn(renewalDate, LocaleFormat.LL);
};
