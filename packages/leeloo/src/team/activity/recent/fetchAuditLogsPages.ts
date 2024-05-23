import { getUnixTime, subYears } from 'date-fns';
import { GetAuditLogQueryResult, GetAuditLogQueryResultsState, StartAuditLogsQueryResultSuccess, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { AuditLogDownloadError, FlowStep, UserDownloadAuditLogsDataEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
const REQUEST_SIZE = 1000;
export async function startAuditLogsQuery(): Promise<StartAuditLogsQueryResultSuccess> {
    const currentDate = new Date();
    const currentDateMinusThreeYearsUnix = getUnixTime(subYears(currentDate, 3));
    const currentDateUnix = getUnixTime(currentDate);
    const response = await carbonConnector.startAuditLogsQuery({
        startDateRangeUnix: currentDateMinusThreeYearsUnix,
        endDateRangeUnix: currentDateUnix,
    });
    if (response.success) {
        return response;
    }
    else {
        logEvent(new UserDownloadAuditLogsDataEvent({
            flowStep: FlowStep.Error,
            auditLogDownloadError: AuditLogDownloadError.UnexpectedUnknown,
        }));
        throw new Error('[startAuditLogsQuery] - Server Error: Unable to start audit logs query and fetch queryExecutionId');
    }
}
export async function getAuditLogQueryResults(queryId: string, requestSize: number, nextToken?: string): Promise<GetAuditLogQueryResult> {
    const response = await carbonConnector.getAuditLogQueryResults({
        queryExecutionId: queryId,
        maxResults: requestSize,
        nextToken: nextToken,
    });
    if (response.success &&
        (response.data.state === GetAuditLogQueryResultsState.Running ||
            response.data.state === GetAuditLogQueryResultsState.Queued)) {
        await new Promise<void>((done) => setTimeout(() => done(), 3000));
        return await getAuditLogQueryResults(queryId, requestSize, nextToken);
    }
    return response;
}
export async function fetchAuditLogsPages(fetchPageCompleted: (arg: number) => void, queryId: string, pageNumber = 1, nextToken?: string) {
    const response = await getAuditLogQueryResults(queryId, REQUEST_SIZE, nextToken);
    fetchPageCompleted(pageNumber);
    if (response.success) {
        let logs = response.data.auditLogs;
        if (response.data.nextToken) {
            const nextLogs = await fetchAuditLogsPages(fetchPageCompleted, queryId, pageNumber + 1, response.data.nextToken);
            if (nextLogs) {
                logs = logs.concat(nextLogs);
            }
            return logs;
        }
        else {
            return logs;
        }
    }
    else {
        logEvent(new UserDownloadAuditLogsDataEvent({
            flowStep: FlowStep.Error,
            auditLogDownloadError: AuditLogDownloadError.NoLogData,
        }));
        throw new Error('[fetchAuditLogsPages] - Server Error: Unable to load audit logs data');
    }
}
