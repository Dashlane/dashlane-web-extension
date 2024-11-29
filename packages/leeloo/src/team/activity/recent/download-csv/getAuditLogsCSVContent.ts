import { TranslatorInterface } from "../../../../libs/i18n/types";
import { getAuditLogActivityDescription } from "../audit-logs/getAuditLogActivityDescription";
import {
  ActivityLog,
  ActivityLogType,
} from "@dashlane/risk-monitoring-contracts";
import { FlowStep, UserDownloadAuditLogsDataEvent } from "@dashlane/hermes";
import { logEvent } from "../../../../libs/logs/logEvent";
import { getAuditLogActivityCategory } from "../audit-logs/getAuditLogActivityCategory";
const supportedTypes = Object.values(ActivityLogType);
export const I18N_KEYS = {
  ADMIN: "team_activity_list_head_admin",
  ACTION: "team_activity_list_head_action",
  CATEGORY: "team_activity_list_head_category",
  TIME: "team_activity_list_head_time_csv",
};
export const getAuditLogsCSVContent = (
  auditLogs: ActivityLog[],
  translate: TranslatorInterface,
  withCategories = false
) => {
  const headers = withCategories
    ? [
        translate(I18N_KEYS.ADMIN),
        translate(I18N_KEYS.CATEGORY),
        translate(I18N_KEYS.ACTION),
        translate(I18N_KEYS.TIME),
      ]
    : [
        translate(I18N_KEYS.ADMIN),
        translate(I18N_KEYS.ACTION),
        translate(I18N_KEYS.TIME),
      ];
  const headerRow = headers.join(",") + "\n";
  const filteredAuditLogs = auditLogs
    .filter((log) => supportedTypes.includes(log.log_type as ActivityLogType))
    .map((log) => {
      const user = log.properties?.author_login ?? "";
      const activityDescription = getAuditLogActivityDescription(log, translate)
        .replace(/\*\*/g, "")
        .replace(/[“”]/g, '"');
      const { label: categoryDescription } = getAuditLogActivityCategory(
        log,
        translate
      );
      const dateISOString = new Date(log.date_time).toISOString();
      const datetimeString = `${dateISOString.substr(
        0,
        10
      )} ${dateISOString.substr(11, 8)}`;
      if (!withCategories) {
        return `${user},${activityDescription},${datetimeString}`;
      }
      return `${user},${categoryDescription},${activityDescription},${datetimeString}`;
    });
  logEvent(
    new UserDownloadAuditLogsDataEvent({
      flowStep: FlowStep.Complete,
      auditLogCount: filteredAuditLogs.length,
    })
  );
  return headerRow + filteredAuditLogs.join("\n");
};
