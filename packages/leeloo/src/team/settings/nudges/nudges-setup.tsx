import {
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  IndeterminateLoader,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import NudgesUrlIllustration from "@dashlane/design-system/assets/illustrations/protect-more-than-passwords@2x-light.webp";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  Button as HermesButton,
  IntegrationPlatform,
  NudgeAction,
  UserClickEvent,
  UserSetupNudgesEvent,
} from "@dashlane/hermes";
import { confidentialSSOApi, SsoSolution } from "@dashlane/sso-scim-contracts";
import { GridContainer } from "@dashlane/ui-components";
import { openUrl } from "../../../libs/external-urls";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useTeamBillingInformation } from "../../../libs/hooks/use-team-billing-information";
import { FeatureDescription } from "./components/feature-description";
import { logEvent } from "../../../libs/logs/logEvent";
import {
  FeatureType,
  openBusinessUpgradeUrl,
} from "../../helpers/open-business-upgrade-url";
import { ResponsiveMainSecondaryLayout } from "../components/layout/responsive-main-secondary-layout";
import { UpsellCard } from "../../components/upsell-card";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { useIsBusinessPlus } from "../../helpers/use-is-business-plus";
export const SLACK_INSTALL_URL = "__REDACTED__";
const I18N_KEYS = {
  SET_UP: "team_settings_nudges_setup",
  OVERVIEW_TITLE: "team_settings_nudges_setup_overview_title",
  OVERVIEW_SUBTITLE: "team_settings_nudges_setup_overview_subtitle",
  STEP_ONE_TITLE: "team_settings_nudges_setup_step_one_title",
  STEP_ONE_SUBTITLE: "team_settings_nudges_setup_step_one_subtitle",
  STEP_TWO_TITLE: "team_settings_nudges_setup_step_two_title",
  STEP_TWO_SUBTITLE: "team_settings_nudges_setup_step_two_subtitle",
  STEP_THREE_TITLE: "team_settings_nudges_setup_step_three_title",
  STEP_THREE_SUBTITLE: "team_settings_nudges_setup_step_three_subtitle",
  INCOMPATIBLE: "team_settings_nudges_setup_incompatible",
  UPGRADE_TO_BUSINESS: "team_settings_nudges_setup_upgrade",
};
export const NudgesSetup = ({
  hasNudgesCapability,
}: {
  hasNudgesCapability: boolean;
}) => {
  const { translate } = useTranslate();
  const teamBillingInformation = useTeamBillingInformation();
  const isBusinessPlus = useIsBusinessPlus();
  const teamTrialStatus = useTeamTrialStatus();
  const nitroState = useModuleQuery(confidentialSSOApi, "ssoProvisioning");
  const ssoSolution = nitroState.data?.ssoSolution;
  const dataLoaded = nitroState.status === DataStatus.Success;
  if (!teamTrialStatus) {
    return null;
  }
  const isTrialOrGracePeriod =
    teamTrialStatus.isFreeTrial || teamTrialStatus.isGracePeriod;
  const isNudgesCompatible =
    ssoSolution === SsoSolution.enum.none ||
    ssoSolution === SsoSolution.enum.confidentialSaml;
  const openSlackStore = () => {
    logEvent(
      new UserSetupNudgesEvent({
        action: NudgeAction.StartedSetup,
        integrationPlatform: IntegrationPlatform.Slack,
      })
    );
    openUrl(SLACK_INSTALL_URL);
    window.close();
  };
  const makeCallToAction = () => {
    if (!dataLoaded) {
      return (
        <div sx={{ display: "flex", justifyContent: "center" }}>
          <IndeterminateLoader
            size={"xlarge"}
            data-testid="nudges-setup-loader"
          />
        </div>
      );
    }
    if (!isNudgesCompatible) {
      return (
        <Infobox title={translate(I18N_KEYS.INCOMPATIBLE)} mood="danger" />
      );
    }
    if (!hasNudgesCapability) {
      return (
        <Button
          size="medium"
          layout="iconLeading"
          icon={<Icon name="PremiumOutlined" />}
          onClick={() => {
            logEvent(
              new UserClickEvent({
                button: HermesButton.UpgradeBusinessPlusTier,
              })
            );
            openBusinessUpgradeUrl(
              FeatureType.Nudges,
              teamBillingInformation?.spaceTier,
              isTrialOrGracePeriod
            );
          }}
        >
          {translate(I18N_KEYS.UPGRADE_TO_BUSINESS)}
        </Button>
      );
    }
    return (
      <Button
        size="medium"
        layout="iconLeading"
        icon={<Icon name="ConfigureOutlined" />}
        onClick={openSlackStore}
      >
        {translate(I18N_KEYS.SET_UP)}
      </Button>
    );
  };
  const MainCard = () => (
    <Card
      sx={{
        minHeight: "680px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        borderColor: "ds.border.neutral.quiet.idle",
      }}
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        gap="16px"
        sx={{ maxWidth: "560px", marginY: "75px" }}
      >
        <Flex flexDirection="column" alignItems="center" gap="16px">
          <img
            src={NudgesUrlIllustration}
            sx={{ width: "320px", aspectRatio: "3/2" }}
            alt=""
          />

          <Flex
            flexDirection="column"
            alignItems="center"
            gap="8px"
            sx={{
              maxWidth: "512px",
              textAlign: "center",
            }}
          >
            <Heading
              as="h2"
              textStyle="ds.title.section.large"
              color="ds.text.neutral.catchy"
            >
              {translate(I18N_KEYS.OVERVIEW_TITLE)}
            </Heading>
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.standard"
            >
              {translate(I18N_KEYS.OVERVIEW_SUBTITLE)}
            </Paragraph>
          </Flex>
        </Flex>

        <Flex flexDirection="column" alignItems="left" gap="16px">
          <FeatureDescription
            iconName="ActionAddOutlined"
            title={translate(I18N_KEYS.STEP_ONE_TITLE)}
            description={translate(I18N_KEYS.STEP_ONE_SUBTITLE)}
          />
          <FeatureDescription
            iconName="HealthPositiveOutlined"
            title={translate(I18N_KEYS.STEP_TWO_TITLE)}
            description={translate(I18N_KEYS.STEP_TWO_SUBTITLE)}
          />
          <FeatureDescription
            iconName="TipOutlined"
            title={translate(I18N_KEYS.STEP_THREE_TITLE)}
            description={translate(I18N_KEYS.STEP_THREE_SUBTITLE)}
          />
        </Flex>

        {makeCallToAction()}
      </Flex>
    </Card>
  );
  return hasNudgesCapability && !isBusinessPlus ? (
    <ResponsiveMainSecondaryLayout
      secondaryContentWrapDirection="bottom"
      fullWidth
      secondaryContentWidth="347px"
      sx={{ gap: "16px" }}
      mainContent={<MainCard />}
      secondaryContent={<UpsellCard featureType={FeatureType.Nudges} />}
    />
  ) : (
    <GridContainer sx={{ marginX: "32px", marginBottom: "32px" }}>
      <MainCard />
    </GridContainer>
  );
};
