import { GetReportQueryResult } from '@dashlane/team-admin-contracts';
import { Card, jsx } from '@dashlane/ui-components';
import { PasswordHealthHistory } from './password-health-history/PasswordHealthHistory';
import { PasswordHealthDetailsRow } from './password-health-details-row/PasswordHealthDetailsRow';
interface PasswordHealthCardProps {
    isLoading: boolean;
    report: GetReportQueryResult;
    passwordHealthHistoryEmpty: boolean;
}
export const PasswordHealthCard = ({ isLoading, report, passwordHealthHistoryEmpty, }: PasswordHealthCardProps) => {
    return (<Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            borderColor: 'ds.border.neutral.quiet.idle',
        }}>
      <PasswordHealthHistory isLoading={isLoading} history={report.passwordHealthHistory} passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}/>
      <PasswordHealthDetailsRow {...report.passwordHealth} passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}/>
    </Card>);
};
