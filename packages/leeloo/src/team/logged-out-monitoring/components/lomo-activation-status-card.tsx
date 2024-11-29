import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  DisplayField,
  Flex,
  Heading,
  mergeSx,
  Paragraph,
  useToast,
} from "@dashlane/design-system";
import { Card } from "@dashlane/ui-components";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import { isSuccess } from "@dashlane/framework-types";
import {
  ActivityLogCategory,
  loggedOutMonitoringApi,
} from "@dashlane/risk-monitoring-contracts";
import {
  PageView,
  RiskDetectionSetupStep,
  UserSetupRiskDetectionEvent,
} from "@dashlane/hermes";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { LOCALE_FORMAT } from "../../../libs/i18n/helpers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { type LoggedOutMonitoringErrorProps } from "../logged-out-monitoring";
import { LOMO_STYLES } from "../styles";
const I18N_KEYS = {
  BUTTON_DOWNLOAD:
    "team_risk_detection_setup_guidelines_script_field_download_button",
  BUTTON_COPY_TOKEN:
    "team_risk_detection_setup_guidelines_token_field_copy_button",
  BUTTON_SEE_LOGS: "team_risk_detection_setup_status_see_logs_button",
  BUTTON_TURN_OFF:
    "team_risk_detection_setup_status_integration_status_turn_off_button",
  FIELD_SCRIPT: "team_risk_detection_setup_guidelines_script_field_title",
  FIELD_TOKEN: "team_risk_detection_setup_guidelines_token_field_title",
  HEADING: "team_risk_detection_setup_status_title",
  INTEGRATION_STATUS:
    "team_risk_detection_setup_status_integration_status_title",
  STATUS_BADGE_LABEL:
    "team_risk_detection_setup_status_integration_status_badge_label",
  STATUS_LAST_LOG_DATE_TITLE:
    "team_risk_detection_setup_status_last_log_date_title",
  STATUS_NO_LOGS_YET: "team_risk_detection_setup_status_no_logs_yet",
  TOAST_LOMO_TURNED_OFF: "team_risk_detection_setup_status_turned_off_toast",
  TOAST_TOKEN_COPIED: "team_risk_detection_setup_status_token_copied_toast",
  TOAST_CLOSE: "team_risk_detection_setup_status_close_toast",
  TOAST_DOWNLOAD_ERROR_DESCRIPTION:
    "team_risk_detection_setup_download_error_description",
  TOAST_DOWNLOAD_ERROR_RETRY: "team_risk_detection_setup_download_error_retry",
  TOAST_ERROR: "_common_generic_error",
};
const VerticalDivider = () => {
  return <div sx={LOMO_STYLES.VERTICAL_DIVIDER} />;
};
interface Props {
  token: string;
  setError: (props: LoggedOutMonitoringErrorProps) => void;
}
export const LomoActivationStatusCard = ({ token, setError }: Props) => {
  const { updateLoggedOutMonitoringActiveStatus } = useModuleCommands(
    loggedOutMonitoringApi
  );
  const lastLogDateResult = useModuleQuery(
    loggedOutMonitoringApi,
    "getLastLogDate"
  );
  const { showToast } = useToast();
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  useEffect(() => {
    logPageView(PageView.TacRiskDetectionSettings);
  }, []);
  const handleDeactivateLOMo = async () => {
    logEvent(
      new UserSetupRiskDetectionEvent({
        riskDetectionSetupStep: RiskDetectionSetupStep.TurnOff,
      })
    );
    const result = await updateLoggedOutMonitoringActiveStatus({
      active: false,
    });
    if (isSuccess(result)) {
      setError({
        hasError: false,
        retryFunction: undefined,
      });
      showToast({
        description: translate(I18N_KEYS.TOAST_LOMO_TURNED_OFF),
        closeActionLabel: translate(I18N_KEYS.TOAST_CLOSE),
      });
    } else {
      setError({
        hasError: true,
        retryFunction: async () => {
          await handleDeactivateLOMo();
        },
      });
    }
  };
  const handleCopyConfigurationToken = async () => {
    logEvent(
      new UserSetupRiskDetectionEvent({
        riskDetectionSetupStep: RiskDetectionSetupStep.CopyConfigurationToken,
      })
    );
    try {
      await navigator.clipboard.writeText(token);
      showToast({
        description: translate(I18N_KEYS.TOAST_TOKEN_COPIED),
        closeActionLabel: translate(I18N_KEYS.TOAST_CLOSE),
      });
    } catch {
      showToast({
        mood: "danger",
        description: translate(I18N_KEYS.TOAST_ERROR),
        closeActionLabel: translate(I18N_KEYS.TOAST_CLOSE),
      });
    }
  };
  const sendEventLogClickedOnSeeLogs = () => {
    logEvent(
      new UserSetupRiskDetectionEvent({
        riskDetectionSetupStep: RiskDetectionSetupStep.SeeActivityLogs,
      })
    );
  };
  const lastLogDate =
    lastLogDateResult.status === DataStatus.Loading
      ? "..."
      : lastLogDateResult.status === DataStatus.Error
      ? "-"
      : lastLogDateResult.data.lastLogDate === null
      ? translate(I18N_KEYS.STATUS_NO_LOGS_YET)
      : translate.shortDate(
          new Date(lastLogDateResult.data.lastLogDate),
          LOCALE_FORMAT.L_LT
        );
  return (
    <Card sx={LOMO_STYLES.CARD}>
      <Heading
        as="h2"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.HEADING)}
      </Heading>
      <Card
        sx={mergeSx([
          LOMO_STYLES.DISPLAY_FIELD_CONTAINER,
          { padding: "24px", justifyContent: "space-between" },
        ])}
      >
        <Flex flexDirection="row" gap="16px">
          <Flex
            flexDirection="column"
            justifyContent="center"
            gap="4px"
            sx={{ width: "170px" }}
          >
            <Heading
              as="h4"
              textStyle="ds.title.supporting.small"
              color="ds.text.neutral.catchy"
              sx={{ height: "18px" }}
            >
              {translate(I18N_KEYS.INTEGRATION_STATUS)}
            </Heading>
            <Badge
              label={translate(I18N_KEYS.STATUS_BADGE_LABEL)}
              mood="positive"
            />
          </Flex>
          <VerticalDivider />
          <Flex flexDirection="column" justifyContent="center" gap="4px">
            <Heading
              as="h4"
              textStyle="ds.title.supporting.small"
              color="ds.text.neutral.catchy"
              sx={{ height: "18px" }}
            >
              {translate(I18N_KEYS.STATUS_LAST_LOG_DATE_TITLE)}
            </Heading>
            <Paragraph
              textStyle="ds.body.reduced.monospace"
              color="ds.text.neutral.standard"
            >
              {lastLogDate}
            </Paragraph>
          </Flex>
        </Flex>
        <Button
          as={Link}
          to={`${routes.teamActivityRoutePath}/recent?categoryFilters=${ActivityLogCategory.RiskDetection}`}
          mood="brand"
          intensity="quiet"
          layout="iconTrailing"
          icon="ArrowRightOutlined"
          sx={{ alignSelf: "end" }}
          onClick={sendEventLogClickedOnSeeLogs}
        >
          {translate(I18N_KEYS.BUTTON_SEE_LOGS)}
        </Button>
      </Card>
      <Card sx={LOMO_STYLES.DISPLAY_FIELD_CONTAINER}>
        <DisplayField
          actions={[
            <Button
              key="CopyToken"
              intensity="supershy"
              layout="iconLeading"
              icon="ActionCopyOutlined"
              onClick={handleCopyConfigurationToken}
            >
              {translate(I18N_KEYS.BUTTON_COPY_TOKEN)}
            </Button>,
          ]}
          label={translate(I18N_KEYS.FIELD_TOKEN)}
          value={token}
          sx={{ width: "-webkit-fill-available" }}
        />
      </Card>
      <Button sx={{ alignSelf: "end" }} onClick={handleDeactivateLOMo}>
        {translate(I18N_KEYS.BUTTON_TURN_OFF)}
      </Button>
    </Card>
  );
};
