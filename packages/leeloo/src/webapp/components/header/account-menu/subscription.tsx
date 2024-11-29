import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Badge, DropdownItem } from "@dashlane/design-system";
import { PremiumStatus, SpaceTiers } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { usePremiumStatus } from "../../../../libs/carbon/hooks/usePremiumStatus";
import { useOpenTeamConsole } from "../../../../libs/hooks/use-open-team-console";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import {
  getActiveSpace,
  getPlanNameFromTier,
  isAccountBusiness,
  isAccountFamily,
  isAdvancedPlan,
  isEssentialsPlan,
  isFreeTrial,
  isPaidAccount,
  isPremiumPlan,
  isPremiumPlusPlan,
} from "../../../../libs/account/helpers";
const I18N_KEYS = {
  SUBSCRIPTION: "manage_subscription_page_title",
  PLAN_NAME: {
    BUSINESS: "manage_subscription_plan_name_business",
    BUSINESS_PLUS: "manage_subscription_plan_name_business_plus",
    TEAM: "manage_subscription_plan_name_team",
    ADVANCED: "manage_subscription_plan_name_advanced",
    ESSENTIALS: "manage_subscription_plan_name_essentials",
    FAMILY: "manage_subscription_plan_name_family",
    FREE: "manage_subscription_plan_name_free",
    PREMIUM: "manage_subscription_plan_name_premium",
    PREMIUM_PLUS: "manage_subscription_plan_name_premium_plus",
    PREMIUM_TRIAL: "manage_subscription_plan_name_premium_trial",
    STANDARD: "manage_subscription_plan_name_standard",
  },
};
const getPlanNameKey = (status: PremiumStatus, isAccountB2B: boolean) => {
  if (isAccountB2B) {
    const activeSpace = getActiveSpace(status);
    if (
      activeSpace &&
      getPlanNameFromTier(activeSpace.tier) === SpaceTiers.Team
    ) {
      return I18N_KEYS.PLAN_NAME.TEAM;
    } else if (
      activeSpace &&
      getPlanNameFromTier(activeSpace.tier) === SpaceTiers.Standard
    ) {
      return I18N_KEYS.PLAN_NAME.STANDARD;
    } else if (
      activeSpace &&
      getPlanNameFromTier(activeSpace.tier) === SpaceTiers.BusinessPlus
    ) {
      return I18N_KEYS.PLAN_NAME.BUSINESS_PLUS;
    } else {
      return I18N_KEYS.PLAN_NAME.BUSINESS;
    }
  } else if (isAccountFamily(status)) {
    return I18N_KEYS.PLAN_NAME.FAMILY;
  } else if (isAdvancedPlan(status)) {
    return I18N_KEYS.PLAN_NAME.ADVANCED;
  } else if (isEssentialsPlan(status)) {
    return I18N_KEYS.PLAN_NAME.ESSENTIALS;
  } else if (isFreeTrial(status)) {
    return I18N_KEYS.PLAN_NAME.PREMIUM_TRIAL;
  } else if (isPremiumPlusPlan(status)) {
    return I18N_KEYS.PLAN_NAME.PREMIUM_PLUS;
  } else if (isPremiumPlan(status)) {
    return I18N_KEYS.PLAN_NAME.PREMIUM;
  }
  return I18N_KEYS.PLAN_NAME.FREE;
};
const SubscriptionBadge = () => {
  const { translate } = useTranslate();
  const premiumStatus = usePremiumStatus();
  const isLoading =
    premiumStatus.status !== DataStatus.Success || !premiumStatus.data;
  if (isLoading) {
    return null;
  }
  const isAccountB2B = isAccountBusiness(premiumStatus.data);
  const isAccountPaid = isPaidAccount(premiumStatus.data);
  const isInFreeTrial = isFreeTrial(premiumStatus.data);
  const isAccountPaidOrTrial = isAccountPaid || isInFreeTrial;
  const getPlanName = () => {
    let planName = "...";
    if (
      getActiveSpace(premiumStatus.data) &&
      premiumStatus.data.planName === "2022_team_starter_tier"
    ) {
      planName = "Starter";
    } else {
      planName = translate(getPlanNameKey(premiumStatus.data, isAccountB2B));
    }
    return planName;
  };
  return isAccountPaidOrTrial ? (
    <Badge
      label={getPlanName()}
      iconName={isAccountB2B ? undefined : "PremiumOutlined"}
      layout={"iconLeading"}
      mood={isAccountPaidOrTrial && !isAccountB2B ? "brand" : "neutral"}
    />
  ) : null;
};
interface SubscriptionProps {
  setShowConsoleDialog: (isOpen: boolean) => void;
}
export const Subscription = ({ setShowConsoleDialog }: SubscriptionProps) => {
  const { openTeamConsole } = useOpenTeamConsole();
  const { translate } = useTranslate();
  const { routes, store } = useRouterGlobalSettingsContext();
  const isInExtensionOrDesktop =
    APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
  const isBusinessAdmin =
    store.getState().user?.session?.permissions.tacAccessPermissions.size > 0;
  const handleGoToSubscriptionPage = (e: Event) => {
    e.preventDefault();
    if (isBusinessAdmin) {
      if (isInExtensionOrDesktop) {
        openTeamConsole({
          routeInExtension: routes.teamAccountRoutePath,
        });
      } else {
        setShowConsoleDialog(true);
      }
    } else {
      redirect(routes.userSubscriptionManagement);
    }
  };
  return (
    <DropdownItem
      data-testid="subscriptionItem"
      label={translate(I18N_KEYS.SUBSCRIPTION)}
      onSelect={(e) => handleGoToSubscriptionPage(e)}
      badge={<SubscriptionBadge />}
    />
  );
};
