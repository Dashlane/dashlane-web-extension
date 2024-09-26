import {
  Log,
  logDebug,
  logError,
  logInfo,
  logVerbose,
  logWarn,
  withTag,
} from "Logs/Debugger";
import { SyncLogEntry } from "Libs/Backup/Logs/types";
const withSyncTag = withTag("Sync");
export const logSyncError: Log<SyncLogEntry> = withSyncTag(logError);
export const logSyncWarn: Log<SyncLogEntry> = withSyncTag(logWarn);
export const logSyncInfo: Log<SyncLogEntry> = withSyncTag(logInfo);
export const logSyncDebug: Log<SyncLogEntry> = withSyncTag(logDebug);
export const logSyncVerbose: Log<SyncLogEntry> = withSyncTag(logVerbose);
