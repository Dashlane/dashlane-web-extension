import { PropsWithChildren, useEffect } from "react";
import {
  colors,
  InfoCircleIcon,
  Link,
  Notification,
  Paragraph,
  Tooltip,
  Heading as UiCHeading,
} from "@dashlane/ui-components";
import {
  Card,
  Flex,
  Heading,
  IndeterminateLoader,
} from "@dashlane/design-system";
import {
  DarkWebInsightsSummaryDomainInfo,
  Domain,
  DomainStatus,
  GetDarkWebInsightsSummaryResponse,
} from "@dashlane/communication";
import {
  AccessPath,
  HelpCenterArticleCta,
  UserOpenDomainDarkWebMonitoringEvent,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
import { Link as RouterLink } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import { VIEW_DOMAIN_VERIFICATION_GUIDE_LINK } from "../../dark-web-insights/dark_web_insights_urls";
import secureLock from "./assets/secureLock.svg";
import webQuestionMark from "./assets/webQuestionMark.svg";
import { useSideNavNotification } from "../../side-nav-notifications/use-side-nav-notification";
const I18N_KEYS = {
  HEADING: "team_dashboard_dark_web_insights_heading",
  SECURITY_INCIDENTS: {
    LABEL: "team_dashboard_dark_web_insights_security_incidents",
    TOOLTIP: "team_dashboard_dark_web_insights_security_incidents_tooltip",
  },
  EMAILS_AFFECTED: {
    LABEL: "team_dashboard_dark_web_insights_emails_affected",
    TOOLTIP: "team_dashboard_dark_web_insights_emails_affected_tooltip",
  },
  SUGGESTED_INVITATION: {
    LABEL: "team_dashboard_dark_web_insights_suggested_invitations",
    TOOLTIP: "team_dashboard_dark_web_insights_suggested_invitations_tooltip",
  },
  RETURNING_USER_CTA: "team_dashboard_dark_web_insights_go_to_cta",
  RETURNING_USER_VIEW_DOMAIN_GUIDE_CTA:
    "team_dashboard_dark_web_insights_view_guide_cta",
  UNVERIFIED_MSG: "team_dashboard_dark_web_insights_domain_unverified_msg",
  UNVERIFIED_SUBTEXT:
    "team_dashboard_dark_web_insights_domain_unverified_sub_text",
  INCIDENT_FREE_MSG:
    "team_dashboard_dark_web_insights_domain_incident_free_msg",
  INCIDENT_FREE_SUBTEXT:
    "team_dashboard_dark_web_insights_domain_incident_free_sub_text",
  GENERATING_INSIGHTS_MESSAGE:
    "team_dashboard_dark_web_insights_generating_msg",
  NEW_INCIDENTS_NOTIFICATION_MSG: {
    ONE: "team_dashboard_dark_web_insights_notify_new_incidents_one",
    MANY: "team_dashboard_dark_web_insights_notify_new_incidents_many",
  },
  TEAM_NEW_LABEL: "team_new_label",
};
export const TileDataWithLabel = ({
  count,
  labelAndTooltip,
  primaryColor,
  secondaryColor,
}: {
  count: number;
  labelAndTooltip: {
    LABEL: string;
    TOOLTIP: string;
  };
  primaryColor: string;
  secondaryColor?: string;
}) => {
  const { translate } = useTranslate();
  return (
    <Flex gap="6px" sx={{ margin: "16px 0" }} alignItems="center">
      <UiCHeading size="x-small" color={primaryColor} sx={{ width: "57px" }}>
        {count}
      </UiCHeading>
      <Tooltip
        sx={{ fontSize: 2, maxWidth: "180px" }}
        placement="top"
        content={translate(labelAndTooltip.TOOLTIP)}
      >
        <Paragraph
          aria-label={translate(labelAndTooltip.LABEL)}
          size="small"
          sx={{ minWidth: "calc(100% - 83px)", width: "min-content" }}
          color={secondaryColor ?? primaryColor}
        >
          {translate(labelAndTooltip.LABEL)}
        </Paragraph>
        <InfoCircleIcon
          size={13}
          tabIndex={0}
          color={secondaryColor ?? primaryColor}
        />
      </Tooltip>
    </Flex>
  );
};
export const DWICard = ({
  children,
}: PropsWithChildren<Record<never, never>>) => {
  return (
    <Card
      sx={{
        minHeight: "418px",
        width: "282px",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        borderColor: "ds.border.neutral.quiet.idle",
      }}
    >
      <Flex
        sx={{ minHeight: "418px", padding: "20px" }}
        flexDirection="column"
        justifyContent="space-between"
        alignItems="start"
      >
        {children}
      </Flex>
    </Card>
  );
};
const MessageWithImage = ({
  text,
  subtext,
  imgSrc,
}: {
  text: string;
  subtext: string;
  imgSrc: string;
}) => {
  return (
    <>
      <img src={imgSrc} />
      <Paragraph size="medium" bold sx={{ marginBottom: "8px" }}>
        {text}
      </Paragraph>
      <Paragraph size="small" color={colors.grey00}>
        {subtext}
      </Paragraph>
    </>
  );
};
const DomainNameTag = ({ domain }: { domain: string }) => {
  return (
    <Paragraph
      size="x-small"
      bold
      sx={{
        padding: "4px 8px",
        backgroundColor: `${colors.dashGreen06}`,
        borderRadius: "4px",
        width: "fit-content",
        height: "24px",
        marginBottom: "34px",
      }}
    >
      {domain}
    </Paragraph>
  );
};
const NewBreachNotification = ({
  newLeaksCount,
  newLeaksAffectedEmailCount,
}: {
  newLeaksCount: number;
  newLeaksAffectedEmailCount: number;
}) => {
  const { translate } = useTranslate();
  const { setHasNewBreaches } = useSideNavNotification();
  useEffect(() => {
    if (newLeaksCount > 0) {
      setHasNewBreaches(true);
    }
  }, [newLeaksCount, setHasNewBreaches]);
  const notificationText =
    newLeaksCount > 1
      ? I18N_KEYS.NEW_INCIDENTS_NOTIFICATION_MSG.MANY
      : I18N_KEYS.NEW_INCIDENTS_NOTIFICATION_MSG.ONE;
  return newLeaksCount > 0 ? (
    <Flex
      sx={{
        backgroundColor: colors.pink05,
        borderRadius: "4px",
        padding: "5px 8px",
        marginTop: "25px",
      }}
    >
      <Paragraph
        size="small"
        color={colors.red00}
        sx={{ width: "calc(100% - 5px)" }}
      >
        {translate(notificationText, {
          numIncidents: newLeaksCount,
          count: newLeaksAffectedEmailCount,
        })}
      </Paragraph>
      <Notification dot ariaLabel={translate(I18N_KEYS.TEAM_NEW_LABEL)} />
    </Flex>
  ) : null;
};
const BreachData = ({
  domainInfo,
}: {
  domainInfo: DarkWebInsightsSummaryDomainInfo;
}) => {
  const totalBreaches = domainInfo.leaksCount;
  const emailsAffected = domainInfo.emailsImpactedCount;
  const suggestedInvitations =
    domainInfo.emailsImpactedCount - domainInfo.teamMembersImpactedCount;
  return (
    <>
      <TileDataWithLabel
        count={totalBreaches}
        labelAndTooltip={I18N_KEYS.SECURITY_INCIDENTS}
        primaryColor={colors.dashGreen00}
        secondaryColor={colors.dashGreen01}
      />
      <TileDataWithLabel
        count={emailsAffected}
        labelAndTooltip={I18N_KEYS.EMAILS_AFFECTED}
        primaryColor={colors.dashGreen00}
        secondaryColor={colors.dashGreen01}
      />
      <TileDataWithLabel
        count={suggestedInvitations}
        labelAndTooltip={I18N_KEYS.SUGGESTED_INVITATION}
        primaryColor={colors.dashGreen00}
        secondaryColor={colors.dashGreen01}
      />
      <NewBreachNotification
        newLeaksCount={domainInfo.newLeaksCount}
        newLeaksAffectedEmailCount={domainInfo.newLeaksAffectedEmailCount}
      />
    </>
  );
};
const BreachDataDetails = ({
  domainName,
  domainInfo,
}: {
  domainName: string;
  domainInfo: DarkWebInsightsSummaryDomainInfo;
}) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  return (
    <>
      <section sx={{ width: "100%" }}>
        <DomainNameTag domain={domainName} />
        {domainInfo.leaksCount > 0 ? (
          <BreachData {...{ domainInfo }} />
        ) : (
          <MessageWithImage
            imgSrc={secureLock}
            text={translate(I18N_KEYS.INCIDENT_FREE_MSG, {
              domainName: domainName,
            })}
            subtext={translate(I18N_KEYS.INCIDENT_FREE_SUBTEXT)}
          />
        )}
      </section>
      <RouterLink
        to={routes.teamDarkWebInsightsRoutePath}
        sx={{
          textDecoration: "none",
          color: `${colors.midGreen00}`,
          marginBottom: "16px",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
        onClick={() => {
          logEvent(
            new UserOpenDomainDarkWebMonitoringEvent({
              accessPath: AccessPath.MainDashboardButton,
              isFirstVisit: false,
            })
          );
        }}
      >
        {translate(I18N_KEYS.RETURNING_USER_CTA)}
      </RouterLink>
    </>
  );
};
const UnverifiedDomainMessage = ({ domainName }: { domainName: string }) => {
  const { translate } = useTranslate();
  return (
    <>
      <section sx={{ width: "100%" }}>
        <DomainNameTag domain={domainName} />
        <MessageWithImage
          imgSrc={webQuestionMark}
          text={translate(I18N_KEYS.UNVERIFIED_MSG)}
          subtext={translate(I18N_KEYS.UNVERIFIED_SUBTEXT)}
        />
      </section>
      <Link
        sx={{
          textDecoration: "none",
          fontWeight: "lighter",
          marginBottom: "16px",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
        color={colors.midGreen00}
        target="_blank"
        rel="noopener noreferrer"
        href={VIEW_DOMAIN_VERIFICATION_GUIDE_LINK}
        onClick={() => {
          logEvent(
            new UserOpenHelpCenterEvent({
              helpCenterArticleCta:
                HelpCenterArticleCta.ViewDomainVerificationGuide,
            })
          );
        }}
      >
        {translate(I18N_KEYS.RETURNING_USER_VIEW_DOMAIN_GUIDE_CTA)}
      </Link>
    </>
  );
};
const GeneratingReportMessage = ({ domainName }: { domainName: string }) => {
  const { translate } = useTranslate();
  return (
    <>
      <DomainNameTag domain={domainName} />
      <IndeterminateLoader size={44} sx={{ alignSelf: "center" }} />
      <Paragraph
        size="small"
        color={colors.grey00}
        sx={{
          marginBottom: "3em",
          overflow: "hidden",
          width: "-webkit-fill-available",
        }}
      >
        {translate(I18N_KEYS.GENERATING_INSIGHTS_MESSAGE)}
      </Paragraph>
    </>
  );
};
export const DWITile = ({
  verifiedOrPendingDomain,
  dwiSummaryResponse,
}: {
  verifiedOrPendingDomain: Domain;
  dwiSummaryResponse: GetDarkWebInsightsSummaryResponse | null;
}) => {
  const { translate } = useTranslate();
  const isDomainVerified =
    verifiedOrPendingDomain.status === DomainStatus.valid;
  const monitoringDomainName = verifiedOrPendingDomain.name;
  return (
    <DWICard>
      <Heading
        as="h5"
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
      >
        {translate(I18N_KEYS.HEADING)}
      </Heading>

      {isDomainVerified ? (
        dwiSummaryResponse?.success ? (
          <BreachDataDetails
            domainName={monitoringDomainName}
            domainInfo={dwiSummaryResponse.data[monitoringDomainName]}
          />
        ) : (
          <GeneratingReportMessage domainName={monitoringDomainName} />
        )
      ) : (
        <UnverifiedDomainMessage domainName={monitoringDomainName} />
      )}
    </DWICard>
  );
};
