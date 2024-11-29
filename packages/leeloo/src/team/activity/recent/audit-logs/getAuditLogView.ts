import {
  ActivityLog,
  ActivityLogType,
} from "@dashlane/risk-monitoring-contracts";
import { TranslatorInterface } from "../../../../libs/i18n/types";
import { AuditLogView } from "../types";
import { getAuditLogActivityDescription } from "./getAuditLogActivityDescription";
import { getAuditLogActivityCategory } from "./getAuditLogActivityCategory";
const supportedTypes = Object.values(ActivityLogType);
export const getAuditLogView = (
  log: ActivityLog,
  translate: TranslatorInterface
): AuditLogView | null => {
  return supportedTypes.includes(log.log_type as ActivityLogType)
    ? {
        uuid: log.uuid,
        date: new Date(log.date_time),
        timestampMs: log.date_time,
        category: getAuditLogActivityCategory(log, translate),
        activityDescription: getAuditLogActivityDescription(log, translate),
        userLogin: log.properties?.author_login ?? "",
      }
    : null;
};
