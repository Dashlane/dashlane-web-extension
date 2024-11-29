import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { Badge, Button, Card, Paragraph } from "@dashlane/design-system";
import image from "@dashlane/design-system/assets/illustrations/SCIM-SSO-integration-easy-for-businessess@2x-light.webp";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useSubscriptionCode } from "../../../../libs/hooks/use-subscription-code";
import { useTeamBillingInformation } from "../../../../libs/hooks/use-team-billing-information";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
import { getFeatureLines } from "../helpers";
import { FeatureLine } from "./feature-line";
const I18N_KEYS = {
  UPGRADE_TO_BUSINESS: "account_summary_upgrade_to_business",
  SSO_FEATURE: "account_summary_sso_description",
  TITLE: "account_summary_upgrade_standard_title",
};
const I18N_KEYS_STARTER = {
  TITLE: "account_summary_upgrade_starter_title",
  UNLIMITED_SEATS: "account_summary_unlimited_seats_description",
  UNLIMITED_GROUPS: "account_summary_unlimited_groups_description",
  ACTIVITY_LOGS: "account_summary_activity_logs_description",
};
const I18N_KEYS_TEAM = {
  TITLE: "account_summary_upgrade_team_title",
  SCIM: "account_summary_scim_feature_description",
  FAMILY_FRIENDS_PLAN: "account_summary_family_friends_plan_description",
  PHONE_SUPPORT_FEATURE: "account_summary_phone_support_team_description",
};
export const PlanUpgradeContent = () => {
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  const { routes } = useRouterGlobalSettingsContext();
  const teamBillingInformation = useTeamBillingInformation();
  if (
    !subscriptionCode ||
    !teamBillingInformation ||
    teamBillingInformation.spaceTier === SpaceTier.Business ||
    teamBillingInformation.spaceTier === SpaceTier.BusinessPlus ||
    teamBillingInformation.spaceTier === SpaceTier.Enterprise ||
    teamBillingInformation.spaceTier === SpaceTier.Legacy
  ) {
    return null;
  }
  const isStarterPlan = teamBillingInformation.spaceTier === SpaceTier.Starter;
  const isStandardPlan =
    teamBillingInformation.spaceTier === SpaceTier.Standard;
  const featureLines = getFeatureLines(teamBillingInformation.spaceTier);
  const onBuyDashlane = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.BuyDashlane,
        clickOrigin: ClickOrigin.AccountStatus,
      })
    );
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
        label={translate(I18N_KEYS.UPGRADE_TO_BUSINESS)}
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
          {translate(
            isStandardPlan
              ? I18N_KEYS.TITLE
              : isStarterPlan
              ? I18N_KEYS_STARTER.TITLE
              : I18N_KEYS_TEAM.TITLE
          )}
        </Paragraph>

        {featureLines.map((feature) => (
          <FeatureLine
            key={feature.description}
            iconName={feature.icon}
            description={feature.description}
          />
        ))}
      </div>

      <Button
        mood="brand"
        intensity="catchy"
        icon="PremiumOutlined"
        layout="iconLeading"
        onClick={onBuyDashlane}
        as={Link}
        to={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
      >
        {translate(I18N_KEYS.UPGRADE_TO_BUSINESS)}
      </Button>
    </Card>
  );
};
