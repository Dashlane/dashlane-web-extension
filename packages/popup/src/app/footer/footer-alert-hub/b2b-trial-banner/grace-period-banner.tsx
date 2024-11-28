import { useEffect } from "react";
import { jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useFooterAlertHubContext } from "../footer-alert-hub-context";
import { FooterAlertButton } from "../footer-alert/footer-alert-button";
import { openTeamAccountCheckout } from "../../../more-tools/helpers";
const I18N_KEYS = {
  STATUS_BUSINESS_GRACE_PERIOD:
    "tab/all_items/trial_banner/status_grace_period_trial_extended",
  CTA_PURCHASE_GRACE_PERIOD_BUSINESS:
    "tab/all_items/trial_banner/cta_purchase_grace_period_business",
  CTA_PURCHASE_GRACE_PERIOD_TEAM:
    "tab/all_items/trial_banner/cta_purchase_grace_period_team",
};
const colors: Partial<ThemeUIStyleObject> = {
  backgroundColor: "ds.container.expressive.warning.catchy.idle",
  color: "ds.text.inverse.catchy",
};
interface Props {
  isBusiness: boolean;
}
export const GracePeriodBanner = ({ isBusiness }: Props) => {
  const { translate, translateMarkup } = useTranslate();
  const { setIsFooterAlertHubOpen } = useFooterAlertHubContext();
  const ctaCopy = translate(
    isBusiness
      ? I18N_KEYS.CTA_PURCHASE_GRACE_PERIOD_BUSINESS
      : I18N_KEYS.CTA_PURCHASE_GRACE_PERIOD_TEAM
  );
  const handleClick = () => {
    void logEvent(
      new UserClickEvent({
        button: Button.BuyDashlane,
        clickOrigin: ClickOrigin.Banner,
      })
    );
    void openTeamAccountCheckout();
  };
  setIsFooterAlertHubOpen(true);
  useEffect(() => {
    return () => {
      setIsFooterAlertHubOpen(false);
    };
  }, []);
  return (
    <FooterAlertButton
      colors={colors}
      labelText={translateMarkup(I18N_KEYS.STATUS_BUSINESS_GRACE_PERIOD)}
      buttonText={ctaCopy}
      handleClick={handleClick}
    />
  );
};
