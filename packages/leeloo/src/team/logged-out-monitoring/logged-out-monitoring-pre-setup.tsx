import { Button, Heading, Icon } from "@dashlane/design-system";
import passwordManagerEmployeesUse from "@dashlane/design-system/assets/illustrations/password-manager-employees-use@2x-light.webp";
import { Card, GridContainer } from "@dashlane/ui-components";
import { loggedOutMonitoringApi } from "@dashlane/risk-monitoring-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  PageView,
  RiskDetectionSetupStep,
  UserSetupRiskDetectionEvent,
} from "@dashlane/hermes";
import { isFailure } from "@dashlane/framework-types";
import { useEffect } from "react";
import useTranslate from "../../libs/i18n/useTranslate";
import { ResponsiveMainSecondaryLayout } from "../settings/components/layout/responsive-main-secondary-layout";
import { LOMoFeatureDescription } from "./components/feature-description";
import { logEvent, logPageView } from "../../libs/logs/logEvent";
import { UpsellCard } from "../components/upsell-card";
import { FeatureType } from "../helpers/open-business-upgrade-url";
import { useIsBusinessPlus } from "../helpers/use-is-business-plus";
import { LOMoHelperSideCard } from "./components/lomo-helper-side-card";
const I18N_KEYS = {
  MAIN_CARD_TITLE: "team_risk_detection_presetup_main_card_title",
  MAIN_CARD_DEPLOY_TITLE: "team_risk_detection_presetup_main_card_deploy_title",
  MAIN_CARD_DEPLOY_SUBTITLE:
    "team_risk_detection_presetup_main_card_deploy_subtitle",
  MAIN_CARD_GET_INFORMED_TITLE:
    "team_risk_detection_presetup_main_card_get_informed_title",
  MAIN_CARD_GET_INFORMED_SUBTITLE:
    "team_risk_detection_presetup_main_card_get_informed_subtitle",
  MAIN_CARD_TAKE_ACTION_TITLE:
    "team_risk_detection_presetup_main_card_take_action_title",
  MAIN_CARD_TAKE_ACTION_SUBTITLE:
    "team_risk_detection_presetup_main_card_take_action_subtitle",
  MAIN_CARD_START_SETUP_BUTTON:
    "team_risk_detection_presetup_main_card_start_setup_button",
};
interface LoggedOutMonitoringPreSetupPageProps {
  setError: () => void;
}
export const LoggedOutMonitoringPreSetupPage = ({
  setError,
}: LoggedOutMonitoringPreSetupPageProps) => {
  const { translate } = useTranslate();
  const isBusinessPlus = useIsBusinessPlus();
  const { generateMassDeploymentTeamKey } = useModuleCommands(
    loggedOutMonitoringApi
  );
  useEffect(() => {
    logPageView(PageView.TacRiskDetection);
  }, []);
  const handleStartSetup = async () => {
    logEvent(
      new UserSetupRiskDetectionEvent({
        riskDetectionSetupStep: RiskDetectionSetupStep.StartSetup,
      })
    );
    if (isFailure(await generateMassDeploymentTeamKey())) {
      setError();
    }
  };
  return (
    <ResponsiveMainSecondaryLayout
      mainContent={
        <Card
          sx={{
            minHeight: "680px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            backgroundColor: "ds.container.agnostic.neutral.supershy",
            borderColor: "ds.border.neutral.quiet.idle",
          }}
        >
          <div
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "570px",
              gap: "16px",
            }}
          >
            <div
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <img
                src={passwordManagerEmployeesUse}
                sx={{ width: "240px", aspectRatio: "3/2" }}
                alt=""
              />
              <Heading
                as="h2"
                color="ds.text.neutral.catchy"
                textStyle="ds.title.section.large"
                sx={{ letterSpacing: "-1px", textAlign: "center" }}
              >
                {translate(I18N_KEYS.MAIN_CARD_TITLE)}
              </Heading>
            </div>
            <div
              sx={{
                display: "flex",
                padding: "24px",
                flexDirection: "column",
                alignItems: "left",
                gap: "16px",
              }}
            >
              <LOMoFeatureDescription
                iconName="ToolsOutlined"
                title={translate(I18N_KEYS.MAIN_CARD_DEPLOY_TITLE)}
                description={translate(I18N_KEYS.MAIN_CARD_DEPLOY_SUBTITLE)}
              />
              <LOMoFeatureDescription
                iconName="PhishingAlertOutlined"
                title={translate(I18N_KEYS.MAIN_CARD_GET_INFORMED_TITLE)}
                description={translate(
                  I18N_KEYS.MAIN_CARD_GET_INFORMED_SUBTITLE
                )}
              />
              <LOMoFeatureDescription
                iconName="TipOutlined"
                title={translate(I18N_KEYS.MAIN_CARD_TAKE_ACTION_TITLE)}
                description={translate(
                  I18N_KEYS.MAIN_CARD_TAKE_ACTION_SUBTITLE
                )}
              />
            </div>
            <Button
              size="medium"
              layout="iconTrailing"
              icon={<Icon name="ArrowRightOutlined" />}
              onClick={handleStartSetup}
            >
              {translate(I18N_KEYS.MAIN_CARD_START_SETUP_BUTTON)}
            </Button>
          </div>
        </Card>
      }
      fullWidth
      secondaryContent={
        <GridContainer gap="16px">
          <LOMoHelperSideCard />
          {!isBusinessPlus ? (
            <UpsellCard featureType={FeatureType.CRD} />
          ) : null}
        </GridContainer>
      }
    />
  );
};
