export enum LogLevel {
  Verbose = 0,
  Debug = 10,
  Info = 20,
  Warn = 30,
  Error = 40,
}
export const Silent = 100;
export interface LogEntry {
  message: string;
  level?: LogLevel;
  tag?: string | string[];
  details?: Record<string, unknown>;
}
export type Log<L extends LogEntry> = (logEntry: L) => void;
export type FormatLogMessage = (log: LogEntry) => string;
export type FormatLogDetail = (detail: unknown) => string;
