import { ValuesType } from "@dashlane/framework-types";
export const LogSeverities = Object.freeze({
  TRACE: 1,
  DEBUG: 5,
  INFO: 9,
  WARN: 13,
  ERROR: 17,
  FATAL: 21,
});
export type LogSeverity = ValuesType<typeof LogSeverities>;
export type LogMetadataType =
  | string
  | number
  | boolean
  | undefined
  | null
  | Error
  | unknown;
export type LogMetadata = Record<string, LogMetadataType>;
export class LogContent {
  public static create(params: {
    message: string;
    severity?: LogSeverity;
    metadata?: LogMetadata;
    container?: string;
    module?: string;
    domain?: string;
  }) {
    return new LogContent(
      params.message,
      params.severity ?? LogSeverities.INFO,
      Date.now(),
      params.metadata ?? {},
      params.container ?? "none",
      params.module ?? "none",
      params.domain ?? "none"
    );
  }
  private constructor(
    public message: string,
    public severity: LogSeverity,
    public timestamp: number,
    public metadata?: LogMetadata,
    public container?: string,
    public module?: string,
    public domain?: string
  ) {}
}
export interface LogLocationContextInfo {
  readonly container: string;
  readonly module: string;
  readonly domain?: string;
}
