import { TranslatorInterface } from 'libs/i18n/types';
import { getAuditLogActivityDescription } from '../audit-logs/getAuditLogActivityDescription';
import { ActivityLog, ActivityLogType, } from '@dashlane/risk-monitoring-contracts';
import { FlowStep, UserDownloadAuditLogsDataEvent } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
const supportedTypes = Object.values(ActivityLogType);
export const I18N_KEYS = {
    ADMIN: 'team_activity_list_head_admin',
    ACTION: 'team_activity_list_head_action',
    TIME: 'team_activity_list_head_time_csv',
};
export const getAuditLogsCSVContent = (auditLogs: ActivityLog[], translate: TranslatorInterface) => {
    const headerRow = [
        translate(I18N_KEYS.ADMIN),
        translate(I18N_KEYS.ACTION),
        translate(I18N_KEYS.TIME),
    ].join(',') + '\n';
    const filteredAuditLogs = auditLogs
        .filter((log) => supportedTypes.includes(log.log_type as ActivityLogType))
        .map((log) => {
        const user = log.properties?.author_login ?? '';
        const activityDescription = getAuditLogActivityDescription(log, translate)
            .replace(/\*\*/g, '')
            .replace(/[“”]/g, '"');
        const dateISOString = new Date(log.date_time).toISOString();
        const datetimeString = `${dateISOString.substr(0, 10)} ${dateISOString.substr(11, 8)}`;
        return `${user},${activityDescription},${datetimeString}`;
    });
    logEvent(new UserDownloadAuditLogsDataEvent({
        flowStep: FlowStep.Complete,
        auditLogCount: filteredAuditLogs.length,
    }));
    return headerRow + filteredAuditLogs.join('\n');
};
