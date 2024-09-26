import { LogEntry } from "Logs/Debugger";
export enum SyncLoggerStep {
  Main,
  Chronological,
  Latest,
  Decipher,
  DecipherFullBackup,
  DecipherTransactions,
  Duplicate,
  Cipher,
  Upload,
  Save,
  TreatProblem,
  TreatProblemSummary,
  Sharing,
  TeamAdminData,
}
export interface SyncLogEntry extends LogEntry {
  message: string;
  details: {
    step: SyncLoggerStep;
    Type?: string;
    Timestamp?: number;
    Update?: number;
    Delete?: number;
    Summary?: number;
    Download?: number;
    Upload?: number;
    Lock?: boolean;
    SharingKeys?: boolean;
    FullBackup?: number;
    Cause?: string;
    Count?: number;
    Transactions?: number;
    Action?: string;
    Date?: number;
    Id?: string;
    Result?: string;
    LocalDate?: number;
    RemoteDate?: number;
    Local?: number;
    Remote?: number;
  };
}
