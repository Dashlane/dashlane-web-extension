import { useEffect, useState } from "react";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  ActivityLog,
  activityLogsApi,
  ActivityLogsQueryFilters,
  LoadingStatus,
} from "@dashlane/risk-monitoring-contracts";
export interface UseGrapheneInfiniteScrollAuditLogs {
  loadMore: () => void;
  applyFilters: (filters?: ActivityLogsQueryFilters) => void;
  hasMore: boolean;
  isLoading: boolean;
  hasError: boolean;
  list: ActivityLog[];
}
export const useGrapheneInfiniteScrollAuditLogs = (
  startDate: number,
  endDate: number,
  initialFilters?: ActivityLogsQueryFilters
): UseGrapheneInfiniteScrollAuditLogs => {
  const [isStartAuditLogsQueryTriggered, setIsStartAuditLogsQueryTriggered] =
    useState(false);
  const [filters, setFilters] = useState<ActivityLogsQueryFilters | undefined>(
    initialFilters
  );
  const { initiateActivityLogsRetrieval, loadNextActivityLogs } =
    useModuleCommands(activityLogsApi);
  const { data, status } = useModuleQuery(activityLogsApi, "activityLogs");
  useEffect(() => {
    if (!isStartAuditLogsQueryTriggered) {
      initiateActivityLogsRetrieval({
        startDate,
        endDate,
        filters,
        target: "table",
      });
      setIsStartAuditLogsQueryTriggered(true);
    }
  }, [endDate, filters, isStartAuditLogsQueryTriggered, startDate]);
  const hasMore = status === DataStatus.Success ? data.hasMoreData : false;
  const list = status === DataStatus.Success ? data.logs : [];
  const isLoading =
    status === DataStatus.Success
      ? data.status === LoadingStatus.LOADING ||
        (hasMore && data.logs.length === 0)
      : true;
  return {
    list,
    hasMore,
    isLoading: !isStartAuditLogsQueryTriggered || isLoading,
    hasError: status === DataStatus.Error || data?.status === "ERROR",
    loadMore: (maxResults?: number) => {
      return loadNextActivityLogs({
        maxResults,
        target: "table",
      });
    },
    applyFilters: (newFilters) => {
      setFilters(newFilters);
      setIsStartAuditLogsQueryTriggered(false);
    },
  };
};
