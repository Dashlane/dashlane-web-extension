import { Button as HermesButton, UserClickEvent } from "@dashlane/hermes";
import { Badge, Button, Card, Flex, Paragraph } from "@dashlane/design-system";
import image from "@dashlane/design-system/assets/illustrations/SCIM-SSO-integration-easy-for-businessess@2x-light.webp";
import useTranslate from "../../libs/i18n/useTranslate";
import { logEvent } from "../../libs/logs/logEvent";
import { FeatureLine } from "../account/page-side-content/upgrade-content/feature-line";
import {
  FeatureType,
  openBusinessUpgradeUrl,
} from "../helpers/open-business-upgrade-url";
import { useTeamBillingInformation } from "../../libs/hooks/use-team-billing-information";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
const I18N_KEYS = {
  KEEP_ACCESS_BADGE: "team_upsell_card_badge",
  TITLE: "team_upsell_card_title",
  NUDGES_FEATURE: "team_upsell_card_nudges_feature_description",
  CRD_FEATURE: "team_upsell_card_crd_feature_description",
  CSM_FEATURE: "team_upsell_card_csm_feature_description",
  CONTACT_BUTTON: "team_upsell_card_contact_button",
};
interface Props {
  featureType: FeatureType;
}
export const UpsellCard = ({ featureType }: Props) => {
  const { translate } = useTranslate();
  const teamBillingInformation = useTeamBillingInformation();
  const teamTrialStatus = useTeamTrialStatus();
  if (!teamTrialStatus) {
    return null;
  }
  const isTrialOrGracePeriod =
    teamTrialStatus.isFreeTrial || teamTrialStatus.isGracePeriod;
  const handleBuyDashlane = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.ContactSales,
      })
    );
    openBusinessUpgradeUrl(
      featureType,
      teamBillingInformation?.spaceTier,
      isTrialOrGracePeriod
    );
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
      }}
    >
      <Badge
        label={translate(I18N_KEYS.KEEP_ACCESS_BADGE)}
        mood="brand"
        iconName="PremiumOutlined"
        layout="iconLeading"
      />

      <Flex
        sx={{
          flex: 1,
          backgroundColor: "ds.container.agnostic.neutral.quiet",
          padding: "8px 48px",
          borderRadius: "8px",
        }}
        justifyContent="center"
      >
        <img
          role="presentation"
          alt=""
          src={image}
          sx={{ objectFit: "contain", width: "100%", height: "auto" }}
        />
      </Flex>

      <Flex flexDirection="column" gap="16px">
        <Paragraph
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.TITLE)}
        </Paragraph>

        <FeatureLine
          iconName="FeatureAutomationsOutlined"
          description={I18N_KEYS.NUDGES_FEATURE}
        />
        <FeatureLine
          iconName="RiskDetectionOutlined"
          description={I18N_KEYS.CRD_FEATURE}
        />
        <FeatureLine
          iconName="ItemPhoneHomeOutlined"
          description={I18N_KEYS.CSM_FEATURE}
        />
      </Flex>

      <Button onClick={handleBuyDashlane} mood="brand" intensity="catchy">
        {translate(I18N_KEYS.CONTACT_BUTTON)}
      </Button>
    </Card>
  );
};
