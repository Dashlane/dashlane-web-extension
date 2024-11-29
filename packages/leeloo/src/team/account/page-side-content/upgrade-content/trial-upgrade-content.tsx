import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { Badge, Button, Card, Paragraph } from "@dashlane/design-system";
import image from "@dashlane/design-system/assets/illustrations/SCIM-SSO-integration-easy-for-businessess@2x-light.webp";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useSubscriptionCode } from "../../../../libs/hooks/use-subscription-code";
import { openUrl } from "../../../../libs/external-urls";
import { logEvent } from "../../../../libs/logs/logEvent";
import { BUSINESS_BUY } from "../../../urls";
import { FeatureLine } from "./feature-line";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
const I18N_KEYS = {
  BUSINESS_PLAN_BADGE: "account_summary_upgrade_content_business_badge",
  TITLE: "account_summary_upgrade_content_title",
  SSO_FEATURE: "account_summary_sso_feature_description",
  PROTECTION_FEATURE: "account_summary_protection_feature_description",
  PHONE_SUPPORT_FEATURE: "account_summary_phone_support_feature_description",
  BUY_DASHLANE_BUTTON: "account_summary_buy_dashlane_button",
};
export const TrialUpgradeContent = () => {
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  const { routes } = useRouterGlobalSettingsContext();
  const featureFlipsResult = useFeatureFlips();
  const isPostTrialCheckoutEnabled =
    featureFlipsResult.status === DataStatus.Success &&
    featureFlipsResult.data["monetization_extension_post_trial_checkout"];
  const handleBuyDashlane = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.BuyDashlane,
        clickOrigin: ClickOrigin.AccountStatus,
      })
    );
    if (!isPostTrialCheckoutEnabled) {
      openUrl(
        `${BUSINESS_BUY}?plan=business&subCode=${subscriptionCode ?? ""}`
      );
    }
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "368px",
        padding: "24px",
      }}
    >
      <Badge
        label={translate(I18N_KEYS.BUSINESS_PLAN_BADGE)}
        mood="brand"
        iconName="PremiumOutlined"
        layout="iconLeading"
      />

      <div sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <img
          role="presentation"
          alt=""
          src={image}
          sx={{ objectFit: "contain", width: "100%", height: "auto" }}
        />
      </div>

      <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Paragraph
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.TITLE)}
        </Paragraph>

        <FeatureLine
          iconName="SsoOutlined"
          description={I18N_KEYS.SSO_FEATURE}
        />
        <FeatureLine
          iconName="PhishingAlertOutlined"
          description={I18N_KEYS.PROTECTION_FEATURE}
        />
        <FeatureLine
          iconName="ItemPhoneHomeOutlined"
          description={I18N_KEYS.PHONE_SUPPORT_FEATURE}
        />
      </div>

      {isPostTrialCheckoutEnabled ? (
        <Button
          onClick={handleBuyDashlane}
          mood="brand"
          intensity="catchy"
          as={Link}
          to={routes.teamAccountCheckoutRoutePath}
        >
          {translate(I18N_KEYS.BUY_DASHLANE_BUTTON)}
        </Button>
      ) : (
        <Button onClick={handleBuyDashlane} mood="brand" intensity="catchy">
          {translate(I18N_KEYS.BUY_DASHLANE_BUTTON)}
        </Button>
      )}
    </Card>
  );
};
