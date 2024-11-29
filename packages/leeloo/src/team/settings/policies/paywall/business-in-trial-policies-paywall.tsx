import { Button, Infobox } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { useSubscriptionCode } from "../../../../libs/hooks/use-subscription-code";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { BUSINESS_BUY } from "../../../urls";
import { logEvent } from "../../../../libs/logs/logEvent";
const I18N_KEYS = {
  TITLE: "team_settings_in_trial_paywall_repackage_policies_title",
  CTA: "team_settings_in_trial_paywall_repackage_policies_cta",
};
interface BusinessInTrialPoliciesPaywallProps {
  className?: string;
}
export const BusinessInTrialPoliciesPaywall = ({
  className,
}: BusinessInTrialPoliciesPaywallProps) => {
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  const handleOnClick = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.UpgradeBusinessTier,
        clickOrigin: ClickOrigin.BannerTacSettingsPoliciesPaywall,
      })
    );
  };
  const URL = `${BUSINESS_BUY}?plan=business&subCode=${subscriptionCode ?? ""}`;
  return (
    <Infobox
      className={className}
      title={translate(I18N_KEYS.TITLE)}
      size="large"
      actions={[
        <Button
          key="cta"
          onClick={handleOnClick}
          as="a"
          href={URL}
          rel="noreferrer"
          target="_blank"
        >
          {translate(I18N_KEYS.CTA)}
        </Button>,
      ]}
    />
  );
};
