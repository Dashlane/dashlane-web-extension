import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTriggerButton,
  Heading,
  Paragraph,
} from "@dashlane/design-system";
import {
  AlertSeverity,
  GridContainer,
  Pagination,
} from "@dashlane/ui-components";
import {
  FlowStep,
  PageView,
  UserLoadDarkWebInsightsResultsEvent,
  UserSendManualInviteEvent,
} from "@dashlane/hermes";
import { DarkWebInsightsData, NotificationName } from "@dashlane/communication";
import { fetchDarkWebInsightsResults } from "../getDarkWebInsightsResults";
import { Lee } from "../../../lee";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { useNotificationSeen } from "../../../libs/carbon/hooks/useNotificationStatus";
import { EmptyReports } from "../empty-reports/empty-reports";
import {
  NoReportGeneratedMessage,
  ScanningIncidentsLoader,
} from "../loading-status-cards/loading-cards";
import { useTeamSpaceContext } from "../../settings/components/TeamSpaceContext";
import { useTeamMembers } from "../../helpers/useTeamMembers";
import { InviteFlow } from "../invite-flow/invite-flow";
import { DownloadDWIButton } from "../download-dwi-button";
import { ReportTable } from "./report-table";
import { ReportSummary } from "./report-summary/report-summary";
const I18N_KEYS = {
  TITLE: "team_dark_web_insights_table_title",
  PAGINATION_PAGE_SIZE: "team_dark_web_insights_table_pagination_page_size",
  PAGINATION_ITEM_COUNT: "team_dark_web_insights_table_pagination_item_count",
  ERROR_MSG: "team_dark_web_insights_generic_error",
};
const ITEMS_PER_PAGE = [15, 50, 100] as const;
type ItemsPerPage = (typeof ITEMS_PER_PAGE)[number];
export const DWIReport = ({
  lee,
  domainName,
}: {
  lee: Lee;
  domainName: string;
}) => {
  const { translate } = useTranslate();
  const alert = useAlert();
  const { teamId } = useTeamSpaceContext();
  const { teamMembers, refreshTeamMembers } = useTeamMembers(teamId);
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [reportsThisPage, setReportsThisPage] =
    useState<DarkWebInsightsData | null>(null);
  const [isLoadingNewReportTablePage, setIsLoadingNewReportTablePage] =
    useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPage>(15);
  const { unseen: isDWIUnseen, setAsSeen: setDWIAsSeen } = useNotificationSeen(
    NotificationName.TacDarkWebInsightsNewBadge
  );
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedInviteEmails, setSelectedInviteEmails] = useState<Set<string>>(
    new Set([])
  );
  const pendingMembers = teamMembers
    .filter((member) => ["pending", "proposed"].includes(member.status))
    .map((member) => member.login);
  const pendingOrAcceptedTeamMemberEmails = teamMembers
    .filter((member) =>
      ["pending", "proposed", "accepted"].includes(member.status)
    )
    .map((member) => member.login);
  const impactedEmailsNotInPlanNorPendingInvite = useMemo(() => {
    return (
      reportsThisPage?.allImpactedEmails.filter(
        (email) => !pendingOrAcceptedTeamMemberEmails.includes(email)
      ) ?? []
    );
  }, [reportsThisPage?.allImpactedEmails, pendingOrAcceptedTeamMemberEmails]);
  useEffect(() => {
    logPageView(PageView.TacDarkWebInsights);
  }, []);
  const fetchReports = useCallback(
    async (domainName: string, page: number, itemsPerPage: ItemsPerPage) => {
      setIsLoadingNewReportTablePage(true);
      try {
        const response = await fetchDarkWebInsightsResults(
          domainName,
          itemsPerPage,
          itemsPerPage * (page - 1)
        );
        setReportsThisPage(response);
        setPage(page);
        setItemsPerPage(itemsPerPage);
        logEvent(new UserLoadDarkWebInsightsResultsEvent({}));
      } catch {
        alert.showAlert(translate(I18N_KEYS.ERROR_MSG), AlertSeverity.ERROR);
      } finally {
        setShowInitialLoader(false);
        setIsLoadingNewReportTablePage(false);
      }
    },
    []
  );
  useEffect(() => {
    fetchReports(domainName, 1, itemsPerPage);
  }, [domainName]);
  useEffect(() => {
    if (isDWIUnseen && reportsThisPage?.emails) {
      setDWIAsSeen();
    }
  }, [isDWIUnseen, setDWIAsSeen, reportsThisPage?.emails]);
  const inviteAll = useCallback(() => {
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
      return;
    }
    if (impactedEmailsNotInPlanNorPendingInvite.length <= 0) {
      return;
    }
    setShowInviteDialog(true);
    logEvent(
      new UserSendManualInviteEvent({
        flowStep: FlowStep.Start,
        inviteCount: 0,
        inviteFailedCount: 0,
        inviteResentCount: 0,
        inviteSuccessfulCount: 0,
        isImport: false,
        isResend: false,
      })
    );
    setSelectedInviteEmails(new Set(impactedEmailsNotInPlanNorPendingInvite));
  }, [impactedEmailsNotInPlanNorPendingInvite]);
  const handleSingleInvite = (email: string) => {
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
      return;
    }
    setShowInviteDialog(true);
    logEvent(
      new UserSendManualInviteEvent({
        flowStep: FlowStep.Start,
        inviteCount: 0,
        inviteFailedCount: 0,
        inviteResentCount: 0,
        inviteSuccessfulCount: 0,
        isImport: false,
        isResend: false,
      })
    );
    setSelectedInviteEmails(new Set([email]));
  };
  return (
    <>
      {showInitialLoader ? <ScanningIncidentsLoader /> : null}
      {!showInitialLoader && reportsThisPage?.emails ? (
        reportsThisPage.leaksCount === 0 ? (
          <EmptyReports domainName={domainName} />
        ) : (
          <>
            <ReportSummary
              reports={reportsThisPage}
              suggestedInvitees={impactedEmailsNotInPlanNorPendingInvite}
              onInviteAll={inviteAll}
            />

            <Card>
              <div
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                  alignItems: "center",
                }}
              >
                <Heading as="h3">{translate(I18N_KEYS.TITLE)}</Heading>
                <DownloadDWIButton domainName={domainName} />
              </div>
              <ReportTable
                reports={reportsThisPage.emails}
                isLoading={isLoadingNewReportTablePage}
                pendingMembers={pendingMembers}
                emailsToInvite={impactedEmailsNotInPlanNorPendingInvite}
                onInviteAction={handleSingleInvite}
              />
              <GridContainer
                alignItems="center"
                gridTemplateColumns="1fr auto 1fr"
                sx={{
                  paddingTop: 6,
                  paddingBottom: 3,
                }}
              >
                <Paragraph
                  color="ds.text.neutral.quiet"
                  textStyle="ds.body.helper.regular"
                >
                  {translate(I18N_KEYS.PAGINATION_ITEM_COUNT, {
                    first: itemsPerPage * (page - 1) + 1,
                    last: Math.min(
                      itemsPerPage * (page - 1) + itemsPerPage,
                      reportsThisPage.emailsImpactedCount
                    ),
                    total: reportsThisPage.emailsImpactedCount,
                  })}
                </Paragraph>
                <Pagination
                  key={page}
                  totalPages={Math.ceil(
                    reportsThisPage.emailsImpactedCount / itemsPerPage
                  )}
                  currentPage={page}
                  onPageChange={(page) =>
                    fetchReports(domainName, page, itemsPerPage)
                  }
                />
                <DropdownMenu>
                  <DropdownTriggerButton
                    showCaret
                    intensity="supershy"
                    mood="neutral"
                    size="small"
                    sx={{
                      marginLeft: "auto",
                    }}
                  >
                    {translate(I18N_KEYS.PAGINATION_PAGE_SIZE, {
                      pageSize: itemsPerPage,
                    })}
                  </DropdownTriggerButton>
                  <DropdownContent>
                    {ITEMS_PER_PAGE.map((ip) => (
                      <DropdownItem
                        key={ip}
                        label={translate(I18N_KEYS.PAGINATION_PAGE_SIZE, {
                          pageSize: ip,
                        })}
                        onSelect={() =>
                          ip !== itemsPerPage && fetchReports(domainName, 1, ip)
                        }
                      />
                    ))}
                  </DropdownContent>
                </DropdownMenu>
              </GridContainer>
              <InviteFlow
                lee={lee}
                isOpen={showInviteDialog}
                prefilledEmails={selectedInviteEmails}
                onClose={() => {
                  setShowInviteDialog(false);
                  setSelectedInviteEmails(new Set([]));
                }}
                handleInviteCompleteSuccess={() => refreshTeamMembers()}
                teamMembers={teamMembers}
              />
            </Card>
          </>
        )
      ) : null}
      {!showInitialLoader && !reportsThisPage?.emails && domainName !== "" ? (
        <NoReportGeneratedMessage />
      ) : null}
    </>
  );
};
