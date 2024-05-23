import { useCallback, useEffect, useState } from 'react';
import { GetAuditLogQueryResultsState } from '@dashlane/communication';
import { ActivityLog } from '@dashlane/risk-monitoring-contracts';
import { getAuditLogQueryResults, startAuditLogsQuery, } from './fetchAuditLogsPages';
const MAX_RESULTS = 50;
export const useInfiniteScrollAuditLogs = (nextTokenVal: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [list, setList] = useState(<ActivityLog[]>[]);
    const [nextToken, setNextToken] = useState<string | null>('');
    const [queryId, setQueryId] = useState('');
    const [isStartAuditLogsQueryTriggered, setIsStartAuditLogsQueryTriggered] = useState(false);
    const getLogsAndSetNextToken = useCallback(async (queryExecutionId: string) => {
        try {
            setIsLoading(true);
            const response = await getAuditLogQueryResults(queryExecutionId, MAX_RESULTS, nextTokenVal && nextTokenVal !== '' ? nextTokenVal : undefined);
            const failingStateValues = [
                GetAuditLogQueryResultsState.Failed,
                GetAuditLogQueryResultsState.Cancelled,
            ];
            if (!response.success ||
                failingStateValues.includes(response.data.state)) {
                setHasError(true);
            }
            else {
                setList((prev: ActivityLog[] = []) => [
                    ...prev,
                    ...response.data.auditLogs,
                ]);
                if (response?.data.nextToken) {
                    setNextToken(response.data.nextToken);
                }
                else {
                    setNextToken(null);
                }
            }
        }
        catch (err) {
            setHasError(true);
        }
        finally {
            setIsLoading(false);
        }
    }, [nextTokenVal]);
    const startLogs = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await startAuditLogsQuery();
            const { queryExecutionId } = result.data;
            await getLogsAndSetNextToken(queryExecutionId);
            setQueryId(queryExecutionId);
            setIsStartAuditLogsQueryTriggered(true);
        }
        catch (err) {
            setIsLoading(false);
            setHasError(true);
        }
    }, [getLogsAndSetNextToken]);
    useEffect(() => {
        if (!isStartAuditLogsQueryTriggered) {
            startLogs();
        }
        else if (queryId !== '') {
            getLogsAndSetNextToken(queryId);
        }
        else {
            setHasError(true);
        }
    }, [getLogsAndSetNextToken]);
    return {
        isStartAuditLogsQueryTriggered,
        isLoading,
        nextToken,
        hasError,
        list,
    };
};
