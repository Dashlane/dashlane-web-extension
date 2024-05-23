import * as React from 'react';
import { PageView } from '@dashlane/hermes';
import { Lee } from 'lee';
import { logPageView } from 'libs/logs/logEvent';
import { AuditLogs } from './audit-logs';
interface Props {
    lee: Lee;
}
const RecentActivity = (props: Props) => {
    React.useEffect(() => {
        logPageView(PageView.TacActivityList);
    }, []);
    return <AuditLogs lee={props.lee}/>;
};
export default RecentActivity;
