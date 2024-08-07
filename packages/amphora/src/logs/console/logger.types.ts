export enum LogLevel {
  VERBOSE = 0,
  DEBUG = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4,
  SILENT = 10,
}
export type LoggerDetails = Record<string, unknown>;
export type LoggerFunc = (...data: unknown[]) => void;
export interface LoggerFuncParams {
  details?: LoggerDetails;
  message?: string;
  tags?: string[];
  indentDetails?: boolean;
}
