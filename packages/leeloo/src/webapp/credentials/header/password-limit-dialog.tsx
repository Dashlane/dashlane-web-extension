import { useEffect } from "react";
import { Dialog, Paragraph } from "@dashlane/design-system";
import {
  CallToAction,
  PageView,
  UserCallToActionEvent,
} from "@dashlane/hermes";
import { openDashlaneUrl, openUrl } from "../../../libs/external-urls";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import {
  PAYWALL_ACTION,
  PAYWALL_SUBTYPE,
  PAYWALL_TYPE,
} from "../../paywall/logs";
import { GET_PREMIUM_URL } from "../../../app/routes/constants";
const I18N_KEYS = {
  TITLE: "webapp_paywall_password_limit_dialog_header",
  CLOSE: "_common_dialog_dismiss_button",
  SUBTITLE: "webapp_paywall_password_limit_dialog_subtitle",
  UPGRADE_BUTTON: "webapp_paywall_upgrade_premium",
  PLANS_BUTTON: "webapp_paywall_password_limit_dialog_secondary_cta",
};
const UTM_SOURCE_CODE =
  "button:buy_dashlane++origin_page:paywall/free_user_password_limit+origin_component:webapp";
const seePlansOffersLog = new UserCallToActionEvent({
  callToActionList: [CallToAction.SeeAllPlans, CallToAction.BuyDashlane],
  chosenAction: CallToAction.SeeAllPlans,
  hasChosenNoAction: false,
});
const upgradeToPremiumLog = new UserCallToActionEvent({
  callToActionList: [CallToAction.AllOffers, CallToAction.BuyDashlane],
  chosenAction: CallToAction.BuyDashlane,
  hasChosenNoAction: false,
});
const cancelPaywallLog = new UserCallToActionEvent({
  callToActionList: [CallToAction.AllOffers, CallToAction.BuyDashlane],
  hasChosenNoAction: true,
});
interface PasswordLimitDialogProps {
  isVisible: boolean;
  handleDismiss: () => void;
}
export const PasswordLimitDialog = ({
  isVisible,
  handleDismiss,
}: PasswordLimitDialogProps) => {
  const subscriptionCode = useSubscriptionCode();
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  useEffect(() => {
    if (isVisible) {
      logPageView(PageView.PaywallFreeUserPasswordLimitReached);
    }
  }, [isVisible]);
  const tracking = {
    type: PAYWALL_TYPE.PREMIUM_PROMPT,
    subtype: PAYWALL_SUBTYPE.PASSWORD_LIMIT,
    action: PAYWALL_ACTION.GO_PREMIUM,
  };
  const handleOnRequestClose = () => {
    handleDismiss();
    logEvent(cancelPaywallLog);
  };
  const goToCheckout = () => {
    const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${
      subscriptionCode ?? ""
    }&utm_source=${UTM_SOURCE_CODE}`;
    logEvent(upgradeToPremiumLog);
    openUrl(buyDashlaneLink);
  };
  const goToPlans = () => {
    logEvent(seePlansOffersLog);
    openDashlaneUrl(routes.userGoPlans, tracking);
  };
  return (
    <Dialog
      isOpen={isVisible}
      onClose={handleOnRequestClose}
      title={translate(I18N_KEYS.TITLE)}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.UPGRADE_BUTTON),
          onClick: goToCheckout,
          icon: "PremiumOutlined",
          layout: "iconLeading",
        },
        secondary: {
          children: translate(I18N_KEYS.PLANS_BUTTON),
          onClick: goToPlans,
        },
      }}
    >
      <Paragraph
        color="ds.text.neutral.standard"
        textStyle="ds.body.standard.regular"
      >
        {translate(I18N_KEYS.SUBTITLE)}
      </Paragraph>
    </Dialog>
  );
};
