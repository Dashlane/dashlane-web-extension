import { ValuesType } from "@dashlane/framework-types";
interface AuditLog {
  uuid: string;
  team_id: number;
  author_user_id: number;
  category: string;
  log_type: string;
  date_time: number;
  schema_version: string;
  properties?: Record<string, unknown>;
}
export interface StartAuditLogsQueryRequest {
  startDateRangeUnix: number;
  endDateRangeUnix: number;
  authorUserId?: number;
  targetUserId?: number;
  sharingGroupId?: number;
  logType?: string;
  category?: string;
  properties?: [
    {
      propName: string;
      value: string;
    }
  ];
}
export interface StartAuditLogsQueryResultData {
  queryExecutionId: string;
}
export type StartAuditLogsQueryResult =
  | StartAuditLogsQueryResultSuccess
  | StartAuditLogsQueryResultFailure;
export interface StartAuditLogsQueryResultSuccess {
  success: true;
  data: StartAuditLogsQueryResultData;
}
export interface StartAuditLogsQueryResultFailure {
  success: false;
  error: {
    code: ApiAuditLogsErrorType.StartAuditLogsQueryFailed;
    message: string;
  };
}
export enum ApiAuditLogsErrorType {
  StartAuditLogsQueryFailed = "START_AUDIT_LOGS_QUERY_FAILED",
  GetAuditLogQueryResultsFailed = "GET_AUDIT_LOG_QUERY_RESULTS_FAILED",
}
export interface GetAuditLogQueryResultsRequest {
  queryExecutionId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetAuditLogQueryResultsStates = Object.freeze({
  Queued: "QUEUED",
  Running: "RUNNING",
  Succeeded: "SUCCEEDED",
  Failed: "FAILED",
  Cancelled: "CANCELLED",
});
export type GetAuditLogQueryResultsState = ValuesType<
  typeof GetAuditLogQueryResultsStates
>;
export interface GetAuditLogQueryResultsSuccess {
  success: true;
  data: {
    auditLogs: AuditLog[];
    state: GetAuditLogQueryResultsState;
    nextToken: string;
  };
}
export type GetAuditLogQueryResult =
  | GetAuditLogQueryResultsSuccess
  | GetAuditLogQueryResultsFailure;
export interface GetAuditLogQueryResultsFailure {
  success: false;
  error: {
    code: ApiAuditLogsErrorType.GetAuditLogQueryResultsFailed;
    message: string;
  };
}
