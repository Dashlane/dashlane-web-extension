import { KeyValueStorageInfrastructure } from "../state";
import { LogMetadata, LogSeverity } from "../logging/types";
export type DiagnosticsInfra = KeyValueStorageInfrastructure;
export interface DiagnosticsLogs {
  [id: string]: DiagnosticsLog;
}
export interface DiagnosticsLog {
  message: string;
  metadata?: LogMetadata;
  severity: LogSeverity;
  timestamp: number;
  diagnosticsId: string;
  container: string;
  module: string;
  domain?: string;
}
