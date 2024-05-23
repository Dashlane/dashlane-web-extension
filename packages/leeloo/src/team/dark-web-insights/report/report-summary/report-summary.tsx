import { Card, GridChild, GridContainer } from '@dashlane/ui-components';
import { Button, Heading, jsx } from '@dashlane/design-system';
import { DarkWebInsightsData } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { ReportSummaryInfo } from './report-summary-info';
import { ReportSummaryDivider } from './report-summary-divider';
type ReportSummaryProps = {
    reports: DarkWebInsightsData;
    suggestedInvitees: string[];
    onInviteAll: () => void;
};
const I18N_KEYS = {
    INVITATIONS: 'team_dark_web_insights_summary_invitations',
    EMPLOYEE_INVITATION: 'team_dark_web_insights_summary_employee_invitation',
    EMPLOYEES_AFFECTED: 'team_dark_web_insights_summary_employees_affected',
    TOTAL_INCIDENTS: 'team_dark_web_insights_summary_total_incidents',
    NOT_PROTECTED: 'team_dark_web_insights_summary_not_protected',
    SUMMARY_TITLE: 'team_dark_web_insights_summary_title',
    INVITE_ALL_BUTTON: 'team_dark_web_insights_summary_invite_all_button',
};
export const ReportSummary = ({ reports, suggestedInvitees, onInviteAll, }: ReportSummaryProps) => {
    const { translate } = useTranslate();
    return (<Card sx={{ marginBottom: '24px', padding: '24px 24px' }}>
      <Heading as="h3" sx={{ marginBottom: '24px' }}>
        {translate(I18N_KEYS.SUMMARY_TITLE)}
      </Heading>
      <GridContainer gridTemplateColumns="1fr 1px 1fr 1px 1fr max-content" gridTemplateAreas='"label-0 divider-left label-1 divider-right label-2 invite-all" "title-0 divider-left title-1 divider-right title-2 invite-all"' alignItems="center" sx={{
            columnGap: '16px',
            justifyContent: 'center',
        }}>
        <ReportSummaryInfo labelGridArea="label-0" label={translate(I18N_KEYS.EMPLOYEES_AFFECTED)} titleGridArea="title-0" title={reports.emailsImpactedCount}/>
        <ReportSummaryDivider gridArea="divider-left"/>
        <ReportSummaryInfo labelGridArea="label-1" label={translate(I18N_KEYS.TOTAL_INCIDENTS)} titleGridArea="title-1" title={reports.leaksCount}/>
        <ReportSummaryDivider gridArea="divider-right"/>
        <ReportSummaryInfo labelGridArea="label-2" label={translate(I18N_KEYS.NOT_PROTECTED)} titleGridArea="title-2" title={translate(I18N_KEYS.EMPLOYEE_INVITATION, {
            count: suggestedInvitees.length,
        })}/>
        <GridChild gridArea="invite-all" alignSelf="center">
          <Button onClick={onInviteAll}>
            {translate(I18N_KEYS.INVITE_ALL_BUTTON)}
          </Button>
        </GridChild>
      </GridContainer>
    </Card>);
};
