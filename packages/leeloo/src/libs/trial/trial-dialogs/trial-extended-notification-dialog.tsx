import { CallToAction, UserCallToActionEvent } from "@dashlane/hermes";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import { useFeatureFlip, useModuleCommands } from "@dashlane/framework-react";
import { useSubscriptionCode } from "../../hooks/use-subscription-code";
import useTranslate from "../../i18n/useTranslate";
import { logEvent } from "../../logs/logEvent";
import { openUrl } from "../../external-urls";
import { BUSINESS_BUY } from "../../../team/urls";
import { useHistory, useRouterGlobalSettingsContext } from "../../router";
import { TrialExtendedDialog } from "./trial-extended-dialog";
const I18N_KEYS = {
  DISMISS_BUTTON: "team_trial_extended_dialog_dismiss_button",
  BUY_DASHLANE_BUTTON: "team_trial_extended_dialog_buy_dashlane_button",
};
const POST_TRIAL_CHECKOUT_FF = "monetization_extension_post_trial_checkout";
interface Props {
  isOpen: boolean;
  isTeamPlan: boolean;
  onClose: () => void;
}
export const TrialExtendedNotificationDialog = ({
  isOpen,
  onClose,
  isTeamPlan,
}: Props) => {
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  const adminNotificationCommands = useModuleCommands(
    teamAdminNotificationsApi
  );
  const hasPostTrialCheckoutFF = useFeatureFlip(POST_TRIAL_CHECKOUT_FF);
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const buyDashlaneLink = `${BUSINESS_BUY}?plan=${
    isTeamPlan ? "team" : "business"
  }&subCode=${subscriptionCode ?? ""}`;
  const handleClickOnBuyDashlane = () => {
    logEvent(
      new UserCallToActionEvent({
        callToActionList: [CallToAction.BuyDashlane, CallToAction.Dismiss],
        chosenAction: CallToAction.BuyDashlane,
        hasChosenNoAction: false,
      })
    );
    adminNotificationCommands.markNotificationTrialExtendedSeen();
    if (hasPostTrialCheckoutFF) {
      history.push(routes.teamAccountCheckoutRoutePath);
      onClose();
    } else {
      openUrl(buyDashlaneLink);
    }
  };
  if (!isOpen) {
    return null;
  }
  return (
    <TrialExtendedDialog
      onClose={onClose}
      primaryActionLabel={translate(I18N_KEYS.BUY_DASHLANE_BUTTON)}
      primaryActionOnClick={handleClickOnBuyDashlane}
      secondaryActionLabel={translate(I18N_KEYS.DISMISS_BUTTON)}
      secondaryActionOnClick={onClose}
    />
  );
};
