import { useEffect } from "react";
import {
  Button,
  Card,
  Heading,
  Paragraph,
  useToast,
} from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { isSuccess } from "@dashlane/framework-types";
import { loggedOutMonitoringApi } from "@dashlane/risk-monitoring-contracts";
import {
  PageView,
  RiskDetectionSetupStep,
  UserSetupRiskDetectionEvent,
} from "@dashlane/hermes";
import type { LoggedOutMonitoringErrorProps } from "../logged-out-monitoring";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
const I18N_KEYS = {
  TOAST_LOMO_TURNED_ON: "team_risk_detection_setup_toast_turned_on",
  TOAST_CLOSE: "team_risk_detection_setup_toast_close",
  BUTTON_TURN_ON: "team_risk_detection_setup_guidelines_turn_on_button",
  TURN_ON_CARD_DESCRIPTION:
    "team_risk_detection_setup_guidelines_step_turn_on_description",
  TURN_ON_CARD_TITLE: "team_risk_detection_setup_guidelines_step_turn_on_title",
  TURN_ON_CARD_SUBTITLE:
    "team_risk_detection_setup_guidelines_step_turn_on_subtitle",
  TURN_ON_CARD_STEP_NUMBER:
    "team_risk_detection_setup_guidelines_step_turn_on_step_number",
};
type EnableLomoCardProps = {
  setError: (props: LoggedOutMonitoringErrorProps) => void;
};
export const EnableLomoCard = ({ setError }: EnableLomoCardProps) => {
  const { showToast } = useToast();
  const { translate } = useTranslate();
  const { updateLoggedOutMonitoringActiveStatus } = useModuleCommands(
    loggedOutMonitoringApi
  );
  useEffect(() => {
    logPageView(PageView.TacRiskDetectionSetup);
  }, []);
  const handleActivateLOMo = async () => {
    logEvent(
      new UserSetupRiskDetectionEvent({
        riskDetectionSetupStep: RiskDetectionSetupStep.TurnOn,
      })
    );
    const result = await updateLoggedOutMonitoringActiveStatus({
      active: true,
    });
    if (isSuccess(result)) {
      setError({
        hasError: false,
        retryFunction: undefined,
      });
      showToast({
        description: translate(I18N_KEYS.TOAST_LOMO_TURNED_ON),
        closeActionLabel: translate(I18N_KEYS.TOAST_CLOSE),
      });
    } else {
      setError({
        hasError: true,
        retryFunction: async () => {
          await handleActivateLOMo();
        },
      });
    }
  };
  return (
    <Card>
      <Heading
        as="h2"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.TURN_ON_CARD_STEP_NUMBER)}
      </Heading>
      <Heading as="h1" textStyle="ds.title.section.medium">
        {translate(I18N_KEYS.TURN_ON_CARD_TITLE)}
      </Heading>
      <Paragraph textStyle="ds.title.block.medium">
        {translate(I18N_KEYS.TURN_ON_CARD_SUBTITLE)}
      </Paragraph>
      <Paragraph textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.TURN_ON_CARD_DESCRIPTION)}
      </Paragraph>
      <Button sx={{ alignSelf: "end" }} onClick={handleActivateLOMo}>
        {translate(I18N_KEYS.BUTTON_TURN_ON)}
      </Button>
    </Card>
  );
};
