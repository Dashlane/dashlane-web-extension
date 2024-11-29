import { Link } from "react-router-dom";
import { Badge, Button, Card, Paragraph } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Button as HermesButton, UserClickEvent } from "@dashlane/hermes";
import { useFeatureFlip } from "@dashlane/framework-react";
import { PLANS_FF } from "@dashlane/plans-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { logEvent } from "../../../libs/logs/logEvent";
import { getPlanTypes } from "../plan-information/helpers";
const I18N_KEYS = {
  BADGE: "manage_subscription_account_referral_badge",
  TITLE: "manage_subscription_account_referral_title",
  DESCRIPTION: "manage_subscription_account_referral_description",
  BUTTON: "manage_subscription_account_referral_button",
};
export const AccountReferralCard = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const accountReferralFeatureFlip = useFeatureFlip(
    PLANS_FF.ACCOUNT_REFERRAL_PHASE3_FF
  );
  const premiumStatus = usePremiumStatus();
  const handleClick = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.ReferAFriend,
      })
    );
  };
  if (
    !accountReferralFeatureFlip ||
    premiumStatus.status !== DataStatus.Success
  ) {
    return null;
  }
  const { isFamilyInvitee, isBusinessUser, isFreeTrialUser, isPremiumUser } =
    getPlanTypes(premiumStatus.data);
  if (isFamilyInvitee || isBusinessUser || isFreeTrialUser || !isPremiumUser) {
    return null;
  }
  return (
    <Card gap="16px" padding="24px">
      <Badge
        iconName="ItemTaxNumberOutlined"
        label={translate(I18N_KEYS.BADGE)}
        mood="brand"
        intensity="quiet"
        layout="iconLeading"
      />
      <Paragraph
        color="ds.text.neutral.catchy"
        textStyle="ds.title.block.medium"
      >
        {translate(I18N_KEYS.TITLE)}
      </Paragraph>
      <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>

      <Button
        as={Link}
        to={routes.userReferral}
        onClick={handleClick}
        mood="neutral"
        intensity="quiet"
        size="small"
      >
        {translate(I18N_KEYS.BUTTON)}
      </Button>
    </Card>
  );
};
