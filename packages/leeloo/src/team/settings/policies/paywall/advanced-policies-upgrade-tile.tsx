import {
  Button,
  Heading,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
import { logEvent } from "../../../../libs/logs/logEvent";
import { FeatureRow } from "../../../upgrade-tile/upgrade-tile";
const I18N_KEYS = {
  TITLE: "team_settings_starter_repackage_upgrade_tile_title",
  SUBTITLE: "team_settings_starter_repackage_upgrade_tile_subtitle",
  FEATURE_ADVANCED_POLICIES:
    "team_settings_starter_repackage_upgrade_tile_feature_advanced_policies",
  FEATURE_UNLIMITED_SEATS:
    "team_settings_starter_repackage_upgrade_tile_feature_unlimited_seats",
  FEATURE_SSO: "team_settings_starter_repackage_upgrade_tile_feature_sso",
  FEATURE_SCIM: "team_settings_starter_repackage_upgrade_tile_feature_scim",
  CTA: "team_settings_starter_repackage_upgrade_tile_cta",
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "24px",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    border: "1px solid ds.border.neutral.quiet.idle",
    borderRadius: "8px",
  },
  HEADER: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  FEATURES_LIST: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "1fr",
  },
};
export const AdvancedPoliciesUpgradeTile = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const URL = `${routes.teamAccountChangePlanRoutePath}?plan=business`;
  const handleClickOnUpgrade = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.UpgradeBusinessTier,
        clickOrigin: ClickOrigin.FeatureLimitationsBlock,
      })
    );
  };
  return (
    <div sx={SX_STYLES.CONTAINER}>
      <div sx={SX_STYLES.HEADER}>
        <Heading
          as="h5"
          textStyle="ds.title.section.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.TITLE)}
        </Heading>

        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
        >
          {translate(I18N_KEYS.SUBTITLE)}
        </Paragraph>
      </div>

      <div sx={SX_STYLES.FEATURES_LIST}>
        <FeatureRow iconName="SettingsOutlined">
          {translate(I18N_KEYS.FEATURE_ADVANCED_POLICIES)}
        </FeatureRow>
        <FeatureRow iconName="GroupOutlined">
          {translate(I18N_KEYS.FEATURE_UNLIMITED_SEATS)}
        </FeatureRow>
        <FeatureRow iconName="ToolsOutlined">
          {translate(I18N_KEYS.FEATURE_SSO)}
        </FeatureRow>
        <FeatureRow iconName="SharedOutlined">
          {translate(I18N_KEYS.FEATURE_SCIM)}
        </FeatureRow>
      </div>

      <Button
        fullsize
        mood="brand"
        intensity="catchy"
        layout="iconLeading"
        icon="PremiumOutlined"
        onClick={handleClickOnUpgrade}
        as={Link}
        to={URL}
      >
        {translate(I18N_KEYS.CTA)}
      </Button>
    </div>
  );
};
