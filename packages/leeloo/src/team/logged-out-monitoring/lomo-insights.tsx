import { useEffect, useState } from "react";
import {
  Button,
  Card,
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTriggerButton,
  Flex,
  Heading,
  IndeterminateLoader,
  Infobox,
  Paragraph,
  Tabs,
} from "@dashlane/design-system";
import {
  PageView,
  RiskDetectionSetupStep,
  UserSetupRiskDetectionEvent,
} from "@dashlane/hermes";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  ActivityLogCategory,
  loggedOutMonitoringApi,
  TimeScale,
} from "@dashlane/risk-monitoring-contracts";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import useTranslate from "../../libs/i18n/useTranslate";
import lomoGraphPlaceholder from "../../libs/assets/lomo-graph-placeholder.svg";
import { logEvent, logPageView } from "../../libs/logs/logEvent";
import { useHistory, useRouterGlobalSettingsContext } from "../../libs/router";
import { LoggedOutMonitoringErrorProps } from "./logged-out-monitoring";
import { RiskDetectionMetric } from "./components/lomo-metric";
import { InsightsGraph } from "./components/insights-graph";
import { LOMO_STYLES } from "./styles";
const I18N_KEYS = {
  INSIGHTS_METRICS_TITLE_WEEK:
    "team_risk_detection_insights_metrics_title_week",
  INSIGHTS_METRICS_TITLE_MONTH:
    "team_risk_detection_insights_metrics_title_month",
  INSIGHTS_METRICS_TITLE_YEAR:
    "team_risk_detection_insights_metrics_title_year",
  TOTAL_EMPLOYEES_TITLE: "team_risk_detection_insights_total_employees_title",
  TOTAL_WEAK_LOGINS_TITLE:
    "team_risk_detection_insights_total_weak_logins_title",
  TOTAL_COMPROMISED_LOGINS_TITLE:
    "team_risk_detection_insights_total_compromised_logins_title",
  EMPTY_STATE_TITLE: "team_risk_detection_empty_risks_infobox_title",
  EMPTY_STATE_DESCRIPTION:
    "team_risk_detection_empty_risks_infobox_description",
  INFOBOX_RISKS_FOUND_TITLE:
    "team_risk_detection_insights_infobox_risks_detected_title",
  INFOBOX_RISKS_FOUND_DESCRIPTION:
    "team_risk_detection_insights_infobox_risks_detected_description",
  INFOBOX_DISMISS: "team_risk_detection_insights_infobox_dismiss",
  GRAPH_TITLE: "team_risk_detection_insights_graph_title",
  GRAPH_LAST_WEEK: "team_risk_detection_insights_graph_tab_week",
  GRAPH_LAST_MONTH: "team_risk_detection_insights_graph_tab_month",
  GRAPH_LAST_YEAR: "team_risk_detection_insights_graph_tab_year",
  GRAPH_MORE_OPTIONS: "team_risk_detection_insights_graph_more_options",
  BUTTON_SEE_LOGS: "team_risk_detection_insights_see_activity_logs",
};
const VerticalDivider = () => <div sx={LOMO_STYLES.VERTICAL_DIVIDER} />;
export const LomoInsights = ({
  setError,
}: {
  setError: (error: LoggedOutMonitoringErrorProps) => void;
}) => {
  const [timeScale, setTimeScale] = useState<TimeScale>("week");
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const insights = useModuleQuery(
    loggedOutMonitoringApi,
    "getRiskDetectionInsights",
    { timeScale }
  );
  const riskFoundInfoboxQueryResult = useModuleQuery(
    teamAdminNotificationsApi,
    "hasSeenCRDRisksFoundInfobox"
  );
  const { markCRDRisksFoundInfoboxSeen } = useModuleCommands(
    teamAdminNotificationsApi
  );
  const { computeRiskDetectionInsights } = useModuleCommands(
    loggedOutMonitoringApi
  );
  useEffect(() => {
    logPageView(PageView.TacRiskDetectionInsights);
    computeRiskDetectionInsights({ timescale: timeScale });
  }, []);
  useEffect(() => {
    if (insights.status === DataStatus.Error) {
      setError({
        hasError: true,
        retryFunction: () => {
          setError({ hasError: false });
        },
      });
    }
  }, [insights, setError]);
  if (insights.status === DataStatus.Loading) {
    return (
      <div
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          padding: "20vh 0",
        }}
      >
        <IndeterminateLoader size={160} />
      </div>
    );
  }
  if (insights.data?.lastUpdateTimestamp === 0) {
    return (
      <div
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          padding: "20vh 0",
        }}
      >
        <IndeterminateLoader size={160} />
      </div>
    );
  }
  const metricsHeadingKey =
    timeScale === "week"
      ? I18N_KEYS.INSIGHTS_METRICS_TITLE_WEEK
      : timeScale === "month"
      ? I18N_KEYS.INSIGHTS_METRICS_TITLE_MONTH
      : I18N_KEYS.INSIGHTS_METRICS_TITLE_YEAR;
  const metrics = insights.data?.insights;
  const crdHistory = insights.data?.riskDetectionHistory;
  const hasLogsInLastYear = metrics && insights.data?.hasLogsInLastYear;
  const showRisksFoundInfobox =
    !!hasLogsInLastYear &&
    riskFoundInfoboxQueryResult.status === DataStatus.Success &&
    !riskFoundInfoboxQueryResult.data;
  const handleClickOnSeeLogs = () => {
    logEvent(
      new UserSetupRiskDetectionEvent({
        riskDetectionSetupStep: RiskDetectionSetupStep.SeeActivityLogs,
      })
    );
    history.push(
      `${routes.teamActivityRoutePath}/recent?categoryFilters=${ActivityLogCategory.RiskDetection}`
    );
  };
  return (
    <>
      {showRisksFoundInfobox ? (
        <Infobox
          mood="brand"
          icon="TipOutlined"
          size="large"
          title={translate(I18N_KEYS.INFOBOX_RISKS_FOUND_TITLE)}
          description={translate(I18N_KEYS.INFOBOX_RISKS_FOUND_DESCRIPTION)}
          actions={[
            <Button
              key="dismiss"
              intensity="quiet"
              size="small"
              onClick={() => markCRDRisksFoundInfoboxSeen()}
            >
              {"Dismiss"}
            </Button>,
          ]}
        />
      ) : null}
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          padding: "24px",
          gap: "24px",
          backgroundColor: "ds.container.agnostic.neutral.supershy",
          borderColor: "ds.border.neutral.quiet.idle",
        }}
      >
        <Heading as="h2" color="ds.text.neutral.catchy">
          {translate(metricsHeadingKey)}
        </Heading>
        <Flex flexDirection="row" gap="24px">
          <RiskDetectionMetric
            title={translate(I18N_KEYS.TOTAL_EMPLOYEES_TITLE)}
            mood="positive"
            score={hasLogsInLastYear ? metrics.nLogins : null}
          />
          <VerticalDivider />
          <RiskDetectionMetric
            title={translate(I18N_KEYS.TOTAL_WEAK_LOGINS_TITLE)}
            mood="warning"
            score={hasLogsInLastYear ? metrics.nWeak : null}
          />
          <VerticalDivider />
          <RiskDetectionMetric
            title={translate(I18N_KEYS.TOTAL_COMPROMISED_LOGINS_TITLE)}
            mood="danger"
            score={hasLogsInLastYear ? metrics.nCompromised : null}
          />
        </Flex>
      </Card>
      <Card
        gap="24px"
        sx={{
          flexDirection: "column",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "100%",
          backgroundColor: "ds.container.agnostic.neutral.supershy",
          borderColor: "ds.border.neutral.quiet.idle",
        }}
      >
        <Flex flexDirection="row" justifyContent="space-between">
          <Heading as="h2" color="ds.text.neutral.catchy">
            {translate(I18N_KEYS.GRAPH_TITLE)}
          </Heading>
          <Flex flexDirection="row" gap="16px">
            <Tabs
              tabs={[
                {
                  id: "tab-week",
                  title: translate(I18N_KEYS.GRAPH_LAST_WEEK),
                  contentId: "content-week",
                  onSelect: () => {
                    setTimeScale("week");
                  },
                },
                {
                  id: "tab-month",
                  title: translate(I18N_KEYS.GRAPH_LAST_MONTH),
                  contentId: "content-month",
                  onSelect: () => {
                    setTimeScale("month");
                  },
                },
                {
                  id: "tab-year",
                  title: translate(I18N_KEYS.GRAPH_LAST_YEAR),
                  contentId: "content-year",
                  onSelect: () => {
                    setTimeScale("year");
                  },
                },
              ]}
            />
            <DropdownMenu align="end">
              <DropdownTriggerButton
                size="small"
                intensity="supershy"
                layout="iconOnly"
                icon="ActionMoreOutlined"
                aria-label={translate(I18N_KEYS.GRAPH_MORE_OPTIONS)}
                data-testid="CRDInsightsActionsButton"
              />
              <DropdownContent>
                <DropdownItem
                  label={translate(I18N_KEYS.BUTTON_SEE_LOGS)}
                  onSelect={handleClickOnSeeLogs}
                />
              </DropdownContent>
            </DropdownMenu>
          </Flex>
        </Flex>
        {crdHistory && hasLogsInLastYear ? (
          <Flex flexDirection="column" gap="12px">
            <InsightsGraph graphData={crdHistory} timeScale={timeScale} />
          </Flex>
        ) : (
          <Flex
            flexDirection="row"
            justifyContent="center"
            sx={{
              position: "relative",
              textAlign: "center",
            }}
          >
            <Flex justifyContent="center" flexDirection="row">
              <img
                src={lomoGraphPlaceholder}
                width="100%"
                alt={translate(I18N_KEYS.EMPTY_STATE_TITLE)}
              />
            </Flex>
            <Flex
              justifyContent="center"
              flexDirection="column"
              gap="8px"
              sx={{
                maxWidth: "520px",
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Heading
                as="h3"
                color="ds.text.neutral.catchy"
                textStyle="ds.title.block.medium"
              >
                {translate(I18N_KEYS.EMPTY_STATE_TITLE)}
              </Heading>
              <Paragraph
                textStyle="ds.body.standard.regular"
                color="ds.text.neutral.quiet"
              >
                {translate(I18N_KEYS.EMPTY_STATE_DESCRIPTION)}
              </Paragraph>
            </Flex>
          </Flex>
        )}
      </Card>
    </>
  );
};
