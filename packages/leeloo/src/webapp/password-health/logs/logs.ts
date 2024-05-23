import { PageView } from '@dashlane/hermes';
import { logPageView } from 'libs/logs/logEvent';
export enum PASSWORD_HEALTH_ACTION {
    CHANGE_PASSWORD = 'changePassword',
    NEXT = 'next',
    INCLUDE = 'include',
    EXCLUDE = 'exclude',
    CHANGE_NOW = 'changeNow',
    FILTER = 'filter',
    DETAIL = 'detail',
    OPEN_DASHBOARD = 'openDashboard'
}
export enum PASSWORD_HEALTH_SUB_TYPE {
    ALL = 'all',
    COMPROMISED = 'compromised',
    EXCLUDED = 'excluded',
    REUSED = 'reused',
    WEAK = 'weak'
}
export const sendPasswordHealthViewPageLog = () => {
    logPageView(PageView.ToolsPasswordHealthOverview);
};
