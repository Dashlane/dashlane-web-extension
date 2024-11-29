import { Button, Infobox } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { BUSINESS_BUY } from "../../urls";
const I18N_KEYS = {
  TRIAL_INFOBOX_TITLE: "team_activity_business_infobox_title",
  TRIAL_INFOBOX_DESCRIPTION: "team_activity_business_infobox_description",
  BUY_DASHLANE: "team_account_teamplan_plan_buy_dashlane",
};
export const B2BTrialInfobox = () => {
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  const URL = `${BUSINESS_BUY}?plan=business&subCode=${subscriptionCode ?? ""}`;
  const handleBuyDashlane = () => {
    logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.BannerActivityLogPaywall,
        button: HermesButton.UpgradeBusinessTier,
      })
    );
  };
  return (
    <Infobox
      title={translate(I18N_KEYS.TRIAL_INFOBOX_TITLE)}
      description={translate(I18N_KEYS.TRIAL_INFOBOX_DESCRIPTION)}
      size="large"
      actions={[
        <Button
          key="buyDashlane"
          as="a"
          href={URL}
          rel="noopener noreferrer"
          target="_blank"
          onClick={handleBuyDashlane}
        >
          {translate(I18N_KEYS.BUY_DASHLANE)}
        </Button>,
      ]}
      sx={{ marginBottom: "32px" }}
    />
  );
};
