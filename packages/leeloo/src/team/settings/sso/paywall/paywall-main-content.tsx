import {
  Badge,
  Button,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { GridContainer } from "@dashlane/ui-components";
import { openUrl } from "../../../../libs/external-urls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { LearnMoreDropdown } from "../../../../libs/dropdown/learn-more-dropdown";
import {
  BUSINESS_BUY,
  DASHLANE_ADMIN_HELP_CENTER,
  DASHLANE_BLOG_WHATS_SSO,
  DASHLANE_CONFIDENTIAL_SSO,
  DASHLANE_MULTI_DOMAINS,
  DASHLANE_RESOURCES_ZERO_KNOWLEDGE,
  DASHLANE_SELF_HOSTED_SSO,
  SSO_SETUP_OVERVIEW,
} from "../../../urls";
import { DescriptionItem } from "./description-item";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useSubscriptionCode } from "../../../../libs/hooks/use-subscription-code";
const SSO_PAYWALL_UTM_SOURCE =
  "button:upgrade_business_tier+click_origin:sso_paywall_page+origin_page:tac/sso/paywall+origin_component:main_app";
const I18N_KEYS = {
  BADGE_BUSINESS_PLAN: "team_settings_sso_paywall_business_badge",
  PAYWALL_TITLE: "team_settings_sso_paywall_title",
  PAYWALL_DESCRIPTION: "team_settings_sso_paywall_description",
  UPGRADE_BUSINESS: "team_settings_sso_paywall_upgrade_business",
  USER_EXPERIENCE_ITEM: "team_settings_sso_paywall_user_experience_item",
  USER_EXPERIENCE_DESCRIPTION:
    "team_settings_sso_paywall_user_experience_description",
  TRANSPARENCY_ITEM: "team_settings_sso_paywall_transparency_item",
  TRANSPARENCY_DESCRIPTION:
    "team_settings_sso_paywall_transparency_description",
  ACCESS_ITEM: "team_settings_sso_paywall_access_item",
  ACCESS_DESCRIPTION: "team_settings_sso_paywall_access_description",
  CONFIDENTIAL_SSO_ITEM: "team_settings_sso_paywall_confidential_sso_item",
  CONFIDENTIAL_SSO_DESCRIPTION:
    "team_settings_sso_paywall_confidential_sso_description",
};
const LEARN_MORE_DROPDOWN_TITLE = "team_settings_sso_paywall_learn_more";
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
  CONTAINER: {
    borderRadius: "8px",
    border: "1px solid ds.border.neutral.quiet.idle",
    padding: "32px",
    backgroundColor: "ds.background.default",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  HEADER: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
    alignSelf: "stretch",
  },
  ITEMS: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "32px",
    alignSelf: "stretch",
  },
  ACTIONS: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
};
export const PaywallMainContent = ({
  isTrialOrGracePeriod,
}: {
  isTrialOrGracePeriod: boolean;
}) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const subscriptionCode = useSubscriptionCode();
  const handleUpgradeToBusiness = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.UpgradeBusinessTier,
        clickOrigin: ClickOrigin.SsoPaywallPage,
      })
    );
    if (isTrialOrGracePeriod) {
      openUrl(
        `${BUSINESS_BUY}?plan=business&subCode=${
          subscriptionCode ?? ""
        }&utm_source=${SSO_PAYWALL_UTM_SOURCE}`
      );
    } else {
      redirect(`${routes.teamAccountChangePlanRoutePath}?plan=business`);
    }
  };
  const dropdownItems = {
    WHATS_SSO: {
      label: translate("team_settings_sso_paywall_whats_sso"),
      url: DASHLANE_BLOG_WHATS_SSO,
    },
    ZERO_KNOWLEDGE: {
      label: translate("team_settings_sso_paywall_zero_knowledge"),
      url: DASHLANE_RESOURCES_ZERO_KNOWLEDGE,
    },
    MULTI_DOMAINS: {
      label: translate("team_settings_sso_paywall_multi_domains"),
      url: DASHLANE_MULTI_DOMAINS,
    },
    SELF_HOSTED: {
      label: translate("team_settings_sso_paywall_self_hosted"),
      url: DASHLANE_SELF_HOSTED_SSO,
    },
    CONFIDENTIAL_SSO: {
      label: translate("team_settings_sso_paywall_confidential_sso"),
      url: DASHLANE_CONFIDENTIAL_SSO,
    },
    IDENTITY_PROVIDER: {
      label: translate("team_settings_sso_paywall_identity_provider"),
      url: SSO_SETUP_OVERVIEW,
    },
    HELP_CENTER: {
      label: translate("team_settings_sso_paywall_helper_center"),
      url: DASHLANE_ADMIN_HELP_CENTER,
    },
  };
  return (
    <GridContainer gap="32px" alignContent="start" sx={SX_STYLES.CONTAINER}>
      <div sx={SX_STYLES.HEADER}>
        <Badge
          iconName="PremiumOutlined"
          layout="iconLeading"
          label={translate(I18N_KEYS.BADGE_BUSINESS_PLAN)}
          mood="brand"
          intensity="quiet"
        />
        <Paragraph textStyle="ds.title.section.large">
          {translate(I18N_KEYS.PAYWALL_TITLE)}
        </Paragraph>
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
        >
          {translate(I18N_KEYS.PAYWALL_DESCRIPTION)}
        </Paragraph>
      </div>
      <div sx={SX_STYLES.ITEMS}>
        <DescriptionItem
          iconName="ProtectionOutlined"
          title={I18N_KEYS.USER_EXPERIENCE_ITEM}
          subtitle={I18N_KEYS.USER_EXPERIENCE_DESCRIPTION}
        />
        <DescriptionItem
          iconName="FeatureDarkWebMonitoringOutlined"
          title={I18N_KEYS.TRANSPARENCY_ITEM}
          subtitle={I18N_KEYS.TRANSPARENCY_DESCRIPTION}
        />
        <DescriptionItem
          iconName="AccountSettingsOutlined"
          title={I18N_KEYS.ACCESS_ITEM}
          subtitle={I18N_KEYS.ACCESS_DESCRIPTION}
        />
        <DescriptionItem
          iconName="ToolsOutlined"
          title={I18N_KEYS.CONFIDENTIAL_SSO_ITEM}
          subtitle={I18N_KEYS.CONFIDENTIAL_SSO_DESCRIPTION}
        />
      </div>
      <div sx={SX_STYLES.ACTIONS}>
        <LearnMoreDropdown
          dropdownItems={dropdownItems}
          title={translate(LEARN_MORE_DROPDOWN_TITLE)}
        />
        <Button
          mood="brand"
          intensity="catchy"
          icon="PremiumOutlined"
          layout="iconLeading"
          role={isTrialOrGracePeriod ? "link" : undefined}
          onClick={handleUpgradeToBusiness}
        >
          {translate(I18N_KEYS.UPGRADE_BUSINESS)}
        </Button>
      </div>
    </GridContainer>
  );
};
