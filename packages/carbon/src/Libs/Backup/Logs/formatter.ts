import { SyncLoggerStep } from "Libs/Backup/Logs/types";
import { assertUnreachable } from "Helpers/assert-unreachable";
export const formatStep = (step: SyncLoggerStep) => {
  switch (step) {
    case SyncLoggerStep.Main:
      return "[Sync]";
    case SyncLoggerStep.Chronological:
      return "[Sync|Chrono]";
    case SyncLoggerStep.Latest:
      return "[Sync|Latest]";
    case SyncLoggerStep.Decipher:
      return "[Sync|Decipher]";
    case SyncLoggerStep.DecipherFullBackup:
      return "[Sync|Decipher|FullBackup]";
    case SyncLoggerStep.DecipherTransactions:
      return "[Sync|Decipher|Transactions]";
    case SyncLoggerStep.Duplicate:
      return "[Sync|Duplicate]";
    case SyncLoggerStep.Cipher:
      return "[Sync|Cipher]";
    case SyncLoggerStep.Upload:
      return "[Sync|Upload]";
    case SyncLoggerStep.Save:
      return "[Sync|Save]";
    case SyncLoggerStep.TreatProblem:
      return "[Sync|TreatProblem]";
    case SyncLoggerStep.TreatProblemSummary:
      return "[Sync|TreatProblem|Summary]";
    case SyncLoggerStep.Sharing:
      return "[Sync|Sharing]";
    case SyncLoggerStep.TeamAdminData:
      return "[Sync|TeamAdminData]";
    default:
      assertUnreachable(step);
  }
};
