import { Fragment, useCallback, useEffect, useMemo, useReducer, useState, } from 'react';
import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import { AlertSeverity, Card, GridContainer, Pagination, } from '@dashlane/ui-components';
import { FlowStep, PageView, UserLoadDarkWebInsightsResultsEvent, UserSendManualInviteEvent, } from '@dashlane/hermes';
import { DarkWebInsightsData, NotificationName } from '@dashlane/communication';
import { fetchDarkWebInsightsResults } from 'team/dark-web-insights/getDarkWebInsightsResults';
import { Lee } from 'lee';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { useNotificationSeen } from 'libs/carbon/hooks/useNotificationStatus';
import { EmptyReports } from 'team/dark-web-insights/empty-reports/empty-reports';
import { NoReportGeneratedMessage, ScanningIncidentsLoader, } from 'team/dark-web-insights/loading-status-cards/loading-cards';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { useTeamMembers } from 'team/helpers/useTeamMembers';
import { useSideNavNotification } from 'team/side-nav-notifications/use-side-nav-notification';
import { InviteFlow } from '../invite-flow/invite-flow';
import { DownloadDWIButton } from '../download-dwi-button';
import { ReportTable } from './report-table';
import { ReportSummary } from './report-summary/report-summary';
const I18N_KEYS = {
    TITLE: 'team_dark_web_insights_table_title',
    PAGINATION_PAGE_SIZE: 'team_dark_web_insights_table_pagination_page_size',
    ERROR_MSG: 'team_dark_web_insights_generic_error',
};
const PAGE_SIZE = 10;
export const DWIReport = ({ lee, domainName, }: {
    lee: Lee;
    domainName: string;
}) => {
    const { translate } = useTranslate();
    const alert = useAlert();
    const { teamId } = useTeamSpaceContext();
    const { teamMembers, refreshTeamMembers } = useTeamMembers(teamId);
    const { setHasNewBreaches } = useSideNavNotification();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const [showInitialLoader, setShowInitialLoader] = useState(true);
    const [reportsThisPage, setReportsThisPage] = useState<DarkWebInsightsData | null>(null);
    const [isLoadingNewReportTablePage, setIsLoadingNewReportTablePage] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [paginationKey, setPaginationKey] = useReducer((c) => c + 1, 0);
    const { unseen: isDWIUnseen, setAsSeen: setDWIAsSeen } = useNotificationSeen(NotificationName.TacDarkWebInsightsNewBadge);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [selectedInviteEmails, setSelectedInviteEmails] = useState<Set<string>>(new Set([]));
    const pendingMembers = teamMembers
        .filter((member) => ['pending', 'proposed'].includes(member.status))
        .map((member) => member.login);
    const pendingOrAcceptedTeamMemberEmails = teamMembers
        .filter((member) => ['pending', 'proposed', 'accepted'].includes(member.status))
        .map((member) => member.login);
    const impactedEmailsNotInPlanNorPendingInvite = useMemo(() => {
        return (reportsThisPage?.allImpactedEmails.filter((email) => !pendingOrAcceptedTeamMemberEmails.includes(email)) ?? []);
    }, [reportsThisPage?.allImpactedEmails, pendingOrAcceptedTeamMemberEmails]);
    const loadDWIReportsSucceeded = async (domain: string, offset: number) => {
        try {
            const response = await fetchDarkWebInsightsResults(domain, PAGE_SIZE, offset);
            if (response) {
                setReportsThisPage(response);
                return true;
            }
            else {
                return false;
            }
        }
        catch {
            return false;
        }
    };
    useEffect(() => {
        logPageView(PageView.TacDarkWebInsights);
        setHasNewBreaches(false);
        loadDWIReportsSucceeded(domainName, 0).then(() => {
            logEvent(new UserLoadDarkWebInsightsResultsEvent({}));
            setShowInitialLoader(false);
        });
    }, [setHasNewBreaches, domainName]);
    useEffect(() => {
        if (isDWIUnseen && reportsThisPage?.emails) {
            setDWIAsSeen();
        }
    }, [isDWIUnseen, setDWIAsSeen, reportsThisPage?.emails]);
    const onTryPageChange = useCallback(async (newIndex: number) => {
        setIsLoadingNewReportTablePage(true);
        const reportLoaded = await loadDWIReportsSucceeded(domainName, PAGE_SIZE * (newIndex - 1));
        if (reportLoaded) {
            setPage(newIndex);
        }
        else {
            alert.showAlert(translate(I18N_KEYS.ERROR_MSG), AlertSeverity.ERROR);
            setPaginationKey();
        }
        setIsLoadingNewReportTablePage(false);
    }, [alert, domainName, translate]);
    const inviteAll = useCallback(() => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
            return;
        }
        if (impactedEmailsNotInPlanNorPendingInvite.length <= 0) {
            return;
        }
        setShowInviteDialog(true);
        logEvent(new UserSendManualInviteEvent({
            flowStep: FlowStep.Start,
            inviteCount: 0,
            inviteFailedCount: 0,
            inviteResentCount: 0,
            inviteSuccessfulCount: 0,
            isImport: false,
            isResend: false,
        }));
        setSelectedInviteEmails(new Set(impactedEmailsNotInPlanNorPendingInvite));
    }, [impactedEmailsNotInPlanNorPendingInvite]);
    const handleSingleInvite = (email: string) => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
            return;
        }
        setShowInviteDialog(true);
        logEvent(new UserSendManualInviteEvent({
            flowStep: FlowStep.Start,
            inviteCount: 0,
            inviteFailedCount: 0,
            inviteResentCount: 0,
            inviteSuccessfulCount: 0,
            isImport: false,
            isResend: false,
        }));
        setSelectedInviteEmails(new Set([email]));
    };
    return (<>
      {showInitialLoader ? <ScanningIncidentsLoader /> : null}
      {!showInitialLoader && reportsThisPage?.emails ? (reportsThisPage.leaksCount === 0 ? (<EmptyReports domainName={domainName}/>) : (<>
            <ReportSummary reports={reportsThisPage} suggestedInvitees={impactedEmailsNotInPlanNorPendingInvite} onInviteAll={inviteAll}/>

            <Card sx={{ padding: '32px 24px' }}>
              <div sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '24px',
                alignItems: 'center',
            }}>
                <Heading as="h3">{translate(I18N_KEYS.TITLE)}</Heading>
                <DownloadDWIButton domainName={domainName}/>
              </div>
              <ReportTable reports={reportsThisPage.emails} isLoading={isLoadingNewReportTablePage} pendingMembers={pendingMembers} emailsToInvite={impactedEmailsNotInPlanNorPendingInvite} onInviteAction={handleSingleInvite}/>
              <GridContainer gridTemplateColumns="1fr auto 1fr" alignItems="center" sx={{
                paddingTop: 6,
                paddingBottom: 3,
            }}>
                <Paragraph color="ds.text.neutral.quiet" textStyle="ds.title.block.small">
                  {translate(I18N_KEYS.PAGINATION_PAGE_SIZE, {
                pageSize: PAGE_SIZE,
            })}
                </Paragraph>
                <Pagination key={paginationKey} totalPages={Math.ceil(reportsThisPage.emailsImpactedCount / PAGE_SIZE)} currentPage={page} onPageChange={onTryPageChange}/>
              </GridContainer>
              <InviteFlow lee={lee} isOpen={showInviteDialog} prefilledEmails={selectedInviteEmails} onClose={() => {
                setShowInviteDialog(false);
                setSelectedInviteEmails(new Set([]));
            }} handleInviteCompleteSuccess={() => refreshTeamMembers()} teamMembers={teamMembers}/>
            </Card>
          </>)) : null}
      {!showInitialLoader && !reportsThisPage?.emails && domainName !== '' ? (<NoReportGeneratedMessage />) : null}
    </>);
};
