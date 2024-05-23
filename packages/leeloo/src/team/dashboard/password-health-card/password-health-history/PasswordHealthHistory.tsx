import { PasswordHealthHistory as ReportPasswordHealthHistory } from '@dashlane/team-admin-contracts';
import { DataStatus } from '@dashlane/framework-react';
import { Heading, Infobox, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { DASHBOARD_DATA_EPOCH, DISPLAY_HEALTH_SCORE_MIN_PASSWORDS, } from 'team/constants';
import { LineGraph } from './line-graph/LineGraph';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { useTeamCreationDate } from 'team/hooks/use-team-creation-date-unix';
const I18N_KEYS = {
    GRAPH_ALL_TIME_BUTTON: 'team_dashboard_graph_all_time_button',
    GRAPH_HEADING: 'team_dashboard_graph_heading',
    GRAPH_NO_OLD_DATA_WARNING: 'team_dashboard_graph_no_old_data_warning',
    GRAPH_NOT_ENOUGH_DATA_WARNING: 'team_dashboard_graph_not_enough_data_warning',
    GRAPH_HEALTH_WARNING_WITHOUT_SPACES: 'team_dashboard_graph_not_enough_data_warning_min',
    GRAPH_SCORE_HOVER_LEGEND: 'team_dashboard_graph_score_hover_legend',
    GRAPH_SCORE_LEGEND: 'team_dashboard_graph_score_legend',
};
interface GraphProps {
    isLoading: boolean;
    history: ReportPasswordHealthHistory[];
    passwordHealthHistoryEmpty: boolean;
}
export const PasswordHealthHistory = ({ isLoading, history, passwordHealthHistoryEmpty, }: GraphProps) => {
    const { translate } = useTranslate();
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    const teamCreationDate = useTeamCreationDate();
    if (teamCreationDate.status !== DataStatus.Success) {
        return null;
    }
    const shouldMentionBusinessSpace = isPersonalSpaceDisabled.status === DataStatus.Success &&
        !isPersonalSpaceDisabled.isDisabled;
    const showNotEnoughDataWarning = !isLoading && passwordHealthHistoryEmpty;
    const showNoOldDataWarning = !isLoading &&
        !passwordHealthHistoryEmpty &&
        teamCreationDate.teamCreationDate < DASHBOARD_DATA_EPOCH;
    return (<section sx={{
            padding: '3%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        }}>
      <Heading as="h5" color="ds.text.neutral.catchy" textStyle="ds.title.section.medium" sx={{ marginBottom: '1%' }}>
        {translate(I18N_KEYS.GRAPH_HEADING)}
      </Heading>
      {showNotEnoughDataWarning ? (<Infobox size="small" sx={{ marginBottom: '11px' }} title={translate(shouldMentionBusinessSpace
                ? I18N_KEYS.GRAPH_NOT_ENOUGH_DATA_WARNING
                : I18N_KEYS.GRAPH_HEALTH_WARNING_WITHOUT_SPACES, {
                minPasswords: DISPLAY_HEALTH_SCORE_MIN_PASSWORDS,
            })}/>) : null}
      {showNoOldDataWarning ? (<Infobox size="small" sx={{ marginBottom: '11px' }} title={translate(I18N_KEYS.GRAPH_NO_OLD_DATA_WARNING)}/>) : null}
      <LineGraph history={history} passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}/>
    </section>);
};
