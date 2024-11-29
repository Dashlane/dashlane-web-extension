import { colors } from "@dashlane/ui-components";
import { Badge, Button, Heading, Paragraph } from "@dashlane/design-system";
import {
  AccessPath,
  UserOpenDomainDarkWebMonitoringEvent,
} from "@dashlane/hermes";
import {
  DarkWebInsightsSummary,
  GetDarkWebInsightsSummaryResponse,
  NotificationName,
} from "@dashlane/communication";
import { logEvent } from "../../../libs/logs/logEvent";
import { useHistory } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useNotificationSeen } from "../../../libs/carbon/hooks/useNotificationStatus";
import { useTeamSpaceContext } from "../../settings/components/TeamSpaceContext";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import { DWICard, TileDataWithLabel } from "./DWITile";
import employeeMonitoring from "./assets/employeeMonitoring.png";
const I18N_KEYS = {
  TEAM_NEW_LABEL: "team_new_label",
  HEADING: "team_dashboard_dark_web_insights_discovery_heading",
  SUBTEXT: "team_dashboard_dark_web_insights_discovery_subtext",
  ALTERNATE_HEADING:
    "team_dashboard_dark_web_insights_discovery_heading_alternate",
  ALTERNATE_SUBTEXT:
    "team_dashboard_dark_web_insights_discovery_subtext_alternate",
  SECURITY_INCIDENTS: {
    LABEL: "team_dashboard_dark_web_insights_security_incidents",
    TOOLTIP: "team_dashboard_dark_web_insights_security_incidents_tooltip",
  },
  EMAILS_AFFECTED: {
    LABEL: "team_dashboard_dark_web_insights_emails_affected",
    TOOLTIP: "team_dashboard_dark_web_insights_emails_affected_tooltip",
  },
  GET_STARTED_CTA: "team_dashboard_dark_web_insights_discovery_get_started_cta",
};
const GetStartedButton = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const { unseen: isFirstVisit } = useNotificationSeen(
    NotificationName.TacDarkWebInsightsNewBadge
  );
  return (
    <Button
      key="primary"
      onClick={() => {
        logEvent(
          new UserOpenDomainDarkWebMonitoringEvent({
            accessPath: AccessPath.MainDashboardButton,
            isFirstVisit: isFirstVisit,
          })
        );
        history.push(routes.teamDarkWebInsightsRoutePath);
      }}
    >
      {translate(I18N_KEYS.GET_STARTED_CTA)}
    </Button>
  );
};
const AggressiveTile = ({
  data,
  companyName,
}: {
  data: DarkWebInsightsSummary;
  companyName: string;
}) => {
  const { translate } = useTranslate();
  const [firstDomain] = Object.keys(data);
  const domainData = data[firstDomain];
  return (
    <DWICard>
      <Badge
        layout="labelOnly"
        label={translate(I18N_KEYS.TEAM_NEW_LABEL)}
        mood="brand"
      />
      <Heading
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
        as="h3"
        sx={{
          marginTop: "1em",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {translate(I18N_KEYS.HEADING, {
          companyName: companyName,
        })}
      </Heading>
      <Paragraph
        textStyle="ds.body.standard.regular"
        color={"ds.text.neutral.standard"}
      >
        {translate(I18N_KEYS.SUBTEXT)}
      </Paragraph>
      <div
        sx={{
          backgroundColor: `${colors.dashGreen06}`,
          padding: "2px 14px",
          width: "100%",
          borderRadius: "10px",
        }}
      >
        <TileDataWithLabel
          count={domainData.leaksCount}
          labelAndTooltip={I18N_KEYS.SECURITY_INCIDENTS}
          primaryColor={colors.dashGreen01}
        />
        <TileDataWithLabel
          count={domainData.emailsImpactedCount}
          labelAndTooltip={I18N_KEYS.EMAILS_AFFECTED}
          primaryColor={colors.dashGreen01}
        />
      </div>
      <GetStartedButton />
    </DWICard>
  );
};
const AlternateTile = ({ companyName }: { companyName: string }) => {
  const { translate } = useTranslate();
  return (
    <DWICard>
      <div
        sx={{
          alignSelf: "end",
        }}
      >
        <Badge
          layout="labelOnly"
          label={translate(I18N_KEYS.TEAM_NEW_LABEL)}
          mood="brand"
        />
      </div>
      <img
        sx={{
          backgroundColor: `${colors.midGreen05}`,
          height: "122px",
          width: "122px",
          borderRadius: "50%",
          backgroundImage: `url(${employeeMonitoring})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPositionX: "60%",
        }}
      />
      <Heading
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
        as="h3"
        sx={{
          width: "100%",
        }}
      >
        {translate(I18N_KEYS.ALTERNATE_HEADING, {
          companyName: companyName,
        })}
      </Heading>

      <Paragraph
        textStyle="ds.body.standard.regular"
        color={"ds.text.neutral.standard"}
      >
        {translate(I18N_KEYS.ALTERNATE_SUBTEXT)}
      </Paragraph>
      <GetStartedButton />
    </DWICard>
  );
};
export const DWIGetStartedTile = ({
  dwiSummaryResponse,
}: {
  dwiSummaryResponse: GetDarkWebInsightsSummaryResponse | null;
}) => {
  const { spaceDetails } = useTeamSpaceContext();
  const companyName = spaceDetails?.teamName ?? "-";
  return dwiSummaryResponse?.success ? (
    <AggressiveTile data={dwiSummaryResponse.data} companyName={companyName} />
  ) : (
    <AlternateTile companyName={companyName} />
  );
};
