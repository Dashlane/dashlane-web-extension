import { useCallback, useEffect, useRef, useState } from "react";
import { PageView } from "@dashlane/hermes";
import { IndeterminateLoader } from "@dashlane/design-system";
import { type ActivityLogCategory } from "@dashlane/risk-monitoring-contracts";
import { AlertSeverity } from "@dashlane/ui-components";
import { parse } from "query-string";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { useInfiniteScroll } from "../../../libs/hooks/useInfiniteScroll";
import { logPageView } from "../../../libs/logs/logEvent";
import {
  AuditLogsEmpty,
  AuditLogsError,
  AuditLogsLoading,
} from "./audit-logs/audit-logs-states";
import { supportedCategories } from "./audit-logs/getAuditLogActivityCategory";
import { getAuditLogView } from "./audit-logs/getAuditLogView";
import { DownloadCSVDialogGraphene } from "./download-csv/download-csv-dialog-graphene";
import { LogsTable, LogsTableRow } from "./logs-table";
import { useGrapheneInfiniteScrollAuditLogs } from "./useGrapheneInfiniteScrollAuditLogs";
import { DateRange, getDateRangeForPeriod, Period } from "./date-ranges";
import { AuditLogView } from "./types";
import Activity from "../index";
import { ActivityLogsFilterWrapper } from "./audit-logs-filter-wrapper";
import { useLocation } from "../../../libs/router";
export const I18N_KEYS = {
  DOWNLOAD_CSV_ALERT_ERROR: "team_activity_download_modal_alert_error",
  DOWNLOAD_CSV_ALERT_RETRY: "team_activity_download_modal_alert_action",
  DOWNLOAD_CSV_ALERT_DISMISS: "_common_alert_dismiss_button",
  GENERIC_ERROR: "_common_generic_error",
  DATE_RANGE_LAST_DAY: "team_audit_log_date_range_last_day",
  DATE_RANGE_LAST_WEEK: "team_audit_log_date_range_last_week",
  DATE_RANGE_LAST_MONTH: "team_audit_log_date_range_last_month",
  DATE_RANGE_LAST_3_MONTHS: "team_audit_log_date_range_last_3_months",
  DATE_RANGE_LAST_6_MONTHS: "team_audit_log_date_range_last_6_months",
  DATE_RANGE_LAST_YEAR: "team_audit_log_date_range_last_year",
};
export const AuditLogsWithFilters = () => {
  const { translate } = useTranslate();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { search } = useLocation();
  const initialCategoryFilters: ActivityLogCategory | undefined =
    parse(search)?.categoryFilters;
  const [dateRange, setDateRange] = useState<DateRange>(
    getDateRangeForPeriod(Period.LAST_WEEK)
  );
  const { list, hasMore, isLoading, hasError, loadMore, applyFilters } =
    useGrapheneInfiniteScrollAuditLogs(
      dateRange.startDate,
      dateRange.endDate,
      initialCategoryFilters
        ? { categories: [initialCategoryFilters] }
        : undefined
    );
  useInfiniteScroll({
    hasMore,
    scrollContainerRef: containerRef,
    bottomRef,
    loadMore,
  });
  const isLoadingFirstResults = isLoading && !list.length;
  const isLoadingMoreResults = isLoading && list.length;
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const { showAlert } = useAlert();
  const closeDialog = useCallback(() => {
    setDownloadModalOpen(false);
    logPageView(PageView.TacActivityList);
  }, []);
  const startDownload = () => {
    setDownloadModalOpen(true);
  };
  const displayLogs = list
    .map((log) => getAuditLogView(log, translate))
    .filter((view) => view !== null) as AuditLogView[];
  const sortedTranslatedCategories = supportedCategories
    .map((category) => ({
      category,
      translatedCategory: translate(`team_audit_log_category_${category}`),
    }))
    .sort((lhs, rhs) =>
      lhs.translatedCategory < rhs.translatedCategory ? -1 : 1
    );
  useEffect(() => {
    if (hasError) {
      showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
    }
  }, [hasError]);
  return (
    <Activity isLoading={false}>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        ref={containerRef}
      >
        <ActivityLogsFilterWrapper
          applyFilters={applyFilters}
          startDownload={startDownload}
          areFiltersLocked={isLoadingFirstResults}
          hasError={hasError}
          setDateRange={setDateRange}
          sortedTranslatedCategories={sortedTranslatedCategories}
          initialCategoryFilters={
            initialCategoryFilters ? [initialCategoryFilters] : []
          }
        />

        {hasError ? <AuditLogsError /> : null}

        {list.length === 0 && !hasError && !isLoading ? (
          <AuditLogsEmpty />
        ) : null}

        {isLoadingFirstResults && !hasError ? <AuditLogsLoading /> : null}

        {!hasError && list.length > 0 ? (
          <LogsTable withCategories>
            {displayLogs.map((logView) => (
              <LogsTableRow
                login={logView.userLogin}
                categoryIcon={logView.category.icon}
                categoryLabel={logView.category.label}
                activityDescription={logView.activityDescription}
                timestampMs={logView.timestampMs}
                key={`log_${logView.uuid}`}
              />
            ))}
          </LogsTable>
        ) : null}

        <div ref={bottomRef}>
          {isLoadingMoreResults ? (
            <div
              sx={{
                display: "flex",
                height: "40px",
                justifyContent: "center",
                paddingTop: "20px",
                paddingBottom: "60px",
              }}
            >
              <IndeterminateLoader />
            </div>
          ) : null}
        </div>
      </div>

      <DownloadCSVDialogGraphene
        isOpen={downloadModalOpen}
        areLogsLoading={isLoading}
        hasMoreLogs={hasMore}
        logs={list}
        loadMoreLogs={loadMore}
        onClose={closeDialog}
      />
    </Activity>
  );
};
