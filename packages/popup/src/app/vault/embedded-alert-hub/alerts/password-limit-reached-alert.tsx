import { Button, Infobox, jsx } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import {
  GET_PREMIUM_URL,
  openExternalUrl,
} from "../../../../libs/externalUrls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useSubscriptionCode } from "../../../../libs/api";
import { logEvent } from "../../../../libs/logs/logEvent";
const UTM_SOURCE_CODE =
  "button:buy_dashlane+click_origin:banner_password_limit_reached+origin_page:item/credential/list+origin_component:extension_popup";
const I18N_KEYS = {
  PASSWORD_LIMIT_REACHED_TITLE: "tab/all_items/password_limit_reached_title",
  UPGRADE_TO_PREMIUM: "tab/all_items/upgrade_to_premium",
};
export const PasswordLimitReachedAlert = () => {
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  const goToCheckout = () => {
    const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${
      subscriptionCode ?? ""
    }&utm_source=${UTM_SOURCE_CODE}`;
    void logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.BannerPasswordLimitReached,
        button: HermesButton.BuyDashlane,
      })
    );
    void openExternalUrl(buyDashlaneLink);
  };
  return (
    <Infobox
      sx={{ margin: "8px" }}
      title={translate(I18N_KEYS.PASSWORD_LIMIT_REACHED_TITLE)}
      mood="warning"
      size="large"
      icon="FeedbackWarningOutlined"
      actions={[
        <Button
          key={translate(I18N_KEYS.UPGRADE_TO_PREMIUM)}
          size="small"
          mood="warning"
          intensity="catchy"
          onClick={goToCheckout}
          icon="PremiumOutlined"
          layout="iconLeading"
        >
          {translate(I18N_KEYS.UPGRADE_TO_PREMIUM)}
        </Button>,
      ]}
    />
  );
};
