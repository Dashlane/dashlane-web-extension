import { v4 as uuidv4 } from "uuid";
import {
  ActivityLogCategory,
  UserPerformedAutofillCredential,
  UserPerformedAutofillPayment,
} from "@dashlane/risk-monitoring-contracts";
export type AutofillActivityLog =
  | UserPerformedAutofillCredential
  | UserPerformedAutofillPayment;
const makeActivityLog = <T extends AutofillActivityLog>(
  activityLogType: T["log_type"],
  category: ActivityLogCategory,
  properties: T["properties"],
  isSensitive: boolean
): T => {
  return {
    log_type: activityLogType,
    category,
    date_time: new Date().getTime(),
    schema_version: "1.0.0",
    is_sensitive: isSensitive,
    uuid: uuidv4().toUpperCase(),
    properties,
  } as T;
};
export const makeItemUsageActivityLog = <T extends AutofillActivityLog>(
  activityLogType: T["log_type"],
  properties: T["properties"],
  isSensitive = true
): T =>
  makeActivityLog(
    activityLogType,
    ActivityLogCategory.ItemUsage,
    properties,
    isSensitive
  );
