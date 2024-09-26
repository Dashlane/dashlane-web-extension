import {
  MonitorSync,
  SyncAnnouncementContext,
  SyncAnnouncementTypes,
  TreatProblemSummaryComparedCause,
  TreatProblemSummaryComparedResult,
} from "Libs/Backup/Probe";
import { SyncLoggerStep } from "Libs/Backup/Logs/types";
import { syncTypeForSyncLogger } from "Libs/Backup/Logs/utils";
import { formatStep } from "Libs/Backup/Logs/formatter";
import {
  logSyncDebug,
  logSyncError,
  logSyncInfo,
  logSyncVerbose,
  logSyncWarn,
} from "Libs/Backup/Logs/log";
export const makeSyncLoggerMonitor = (): MonitorSync => {
  let syncStartTimestamp: number | null = null;
  const getErrorMessage = (error: unknown) =>
    (typeof error === "object" && error["message"]) || `${error}`;
  const buildMessage = (step: SyncLoggerStep, comment: string) =>
    `${formatStep(step)} ${comment}`;
  return (
    announcement: SyncAnnouncementTypes,
    { timestamp }: SyncAnnouncementContext
  ) => {
    switch (announcement.type) {
      case "SyncStarted":
        {
          const { syncType } = announcement;
          syncStartTimestamp = timestamp;
          logSyncInfo({
            message: buildMessage(SyncLoggerStep.Main, "Start"),
            details: {
              step: SyncLoggerStep.Main,
              Type: syncTypeForSyncLogger(syncType),
            },
          });
        }
        break;
      case "ChronologicalSyncStarted":
        {
          const { updatesCount, deletesCount } = announcement;
          logSyncDebug({
            message: buildMessage(SyncLoggerStep.Chronological, "Start"),
            details: {
              step: SyncLoggerStep.Chronological,
              Timestamp: syncStartTimestamp,
              Update: updatesCount,
              Delete: deletesCount,
            },
          });
        }
        break;
      case "LatestRequested":
        {
          const { lock, needsKeys } = announcement;
          logSyncDebug({
            message: buildMessage(SyncLoggerStep.Latest, "Request"),
            details: {
              step: SyncLoggerStep.Latest,
              Timestamp: syncStartTimestamp,
              Lock: lock,
              SharingKeys: needsKeys,
            },
          });
        }
        break;
      case "LatestSucceeded":
        {
          const { updatesCount, deletesCount, fullBackupSize } = announcement;
          logSyncDebug({
            message: buildMessage(SyncLoggerStep.Latest, "Success"),
            details: {
              step: SyncLoggerStep.Latest,
              Timestamp: syncStartTimestamp,
              Update: updatesCount,
              Delete: deletesCount,
              FullBackup: fullBackupSize,
            },
          });
        }
        break;
      case "LatestFailed":
        {
          const { error } = announcement;
          logSyncWarn({
            message: buildMessage(SyncLoggerStep.Latest, "Error"),
            details: {
              step: SyncLoggerStep.Latest,
              Cause: getErrorMessage(error),
            },
          });
        }
        break;
      case "DecipherStarted":
        {
          const { fullBackupFileSize } = announcement;
          logSyncVerbose({
            message: buildMessage(SyncLoggerStep.Decipher, "Start"),
            details: {
              step: SyncLoggerStep.Decipher,
              Count: fullBackupFileSize,
            },
          });
        }
        break;
      case "DecipherFullBackupSkipped":
        logSyncVerbose({
          message: buildMessage(SyncLoggerStep.DecipherFullBackup, "Skip"),
          details: {
            step: SyncLoggerStep.DecipherFullBackup,
          },
        });
        break;
      case "DecipherFullBackupStarted":
        logSyncVerbose({
          message: buildMessage(SyncLoggerStep.DecipherFullBackup, "Start"),
          details: {
            step: SyncLoggerStep.DecipherFullBackup,
          },
        });
        break;
      case "DecipherFullBackupItemRead":
        {
          const { itemType, itemId, backupDate } = announcement;
          logSyncDebug({
            message: buildMessage(
              SyncLoggerStep.DecipherFullBackup,
              "Transaction"
            ),
            details: {
              step: SyncLoggerStep.DecipherFullBackup,
              Type: itemType,
              Id: itemId,
              Date: backupDate,
            },
          });
        }
        break;
      case "DecipherFullBackupItemSkipped":
        {
          const { error, itemType, itemId } = announcement;
          logSyncDebug({
            message: buildMessage(
              SyncLoggerStep.DecipherFullBackup,
              "TransactionSkipped"
            ),
            details: {
              step: SyncLoggerStep.DecipherFullBackup,
              Type: itemType,
              Id: itemId,
              Cause: getErrorMessage(error),
            },
          });
        }
        break;
      case "DecipherFullBackupFinished":
        {
          const { itemsCount } = announcement;
          logSyncVerbose({
            message: buildMessage(SyncLoggerStep.DecipherFullBackup, "Done"),
            details: {
              step: SyncLoggerStep.DecipherFullBackup,
              Count: itemsCount,
            },
          });
        }
        break;
      case "DecipherFullBackupFailed":
        {
          const { error } = announcement;
          logSyncWarn({
            message: buildMessage(SyncLoggerStep.DecipherFullBackup, "Error"),
            details: {
              step: SyncLoggerStep.DecipherFullBackup,
              Cause: getErrorMessage(error),
            },
          });
        }
        break;
      case "DecipherTransactionsStarted":
        logSyncVerbose({
          message: buildMessage(SyncLoggerStep.DecipherTransactions, "Start"),
          details: {
            step: SyncLoggerStep.DecipherTransactions,
          },
        });
        break;
      case "DecipherTransactionFinished":
        {
          const { action, transactionType, identifier, backupDate } =
            announcement;
          logSyncDebug({
            message: buildMessage(
              SyncLoggerStep.DecipherTransactions,
              "Transaction"
            ),
            details: {
              step: SyncLoggerStep.DecipherTransactions,
              Action: action,
              Type: transactionType,
              Id: identifier,
              Date: backupDate,
            },
          });
        }
        break;
      case "DecipherTransactionFailed":
        {
          const { error, transactionType, identifier, backupDate } =
            announcement;
          logSyncWarn({
            message: buildMessage(SyncLoggerStep.DecipherTransactions, "Error"),
            details: {
              step: SyncLoggerStep.DecipherTransactions,
              Cause: getErrorMessage(error),
              Type: transactionType,
              Id: identifier,
              Date: backupDate,
            },
          });
        }
        break;
      case "DecipherTransactionsFinished":
        logSyncVerbose({
          message: buildMessage(SyncLoggerStep.DecipherTransactions, "Done"),
          details: {
            step: SyncLoggerStep.DecipherTransactions,
          },
        });
        break;
      case "DecipherFinished":
        {
          const { updatesCount, deletesCount } = announcement;
          logSyncVerbose({
            message: buildMessage(SyncLoggerStep.Decipher, "Done"),
            details: {
              step: SyncLoggerStep.Decipher,
              Transactions: updatesCount + deletesCount,
            },
          });
        }
        break;
      case "TransactionDuplicated":
        {
          const { transactionType, identifier, backupDate } = announcement;
          logSyncWarn({
            message: buildMessage(SyncLoggerStep.Duplicate, "Transaction"),
            details: {
              step: SyncLoggerStep.Duplicate,
              Type: transactionType,
              Id: identifier,
              Date: backupDate,
            },
          });
        }
        break;
      case "CipherStarted":
        logSyncVerbose({
          message: buildMessage(SyncLoggerStep.Cipher, "Start"),
          details: {
            step: SyncLoggerStep.Cipher,
          },
        });
        break;
      case "TransactionCiphered":
        {
          const { transactionType, itemId, backupDate } = announcement;
          logSyncDebug({
            message: buildMessage(SyncLoggerStep.Cipher, "Transaction"),
            details: {
              step: SyncLoggerStep.Cipher,
              Type: transactionType,
              Id: itemId,
              Date: backupDate,
            },
          });
        }
        break;
      case "CipherFinished":
        logSyncVerbose({
          message: buildMessage(SyncLoggerStep.Cipher, "Done"),
          details: {
            step: SyncLoggerStep.Cipher,
          },
        });
        break;
      case "UploadRequested":
        {
          const { updatedCount, deletedCount } = announcement;
          logSyncDebug({
            message: buildMessage(SyncLoggerStep.Upload, "Request"),
            details: {
              step: SyncLoggerStep.Upload,
              Update: updatedCount,
              Delete: deletedCount,
            },
          });
        }
        break;
      case "UploadSucceeded":
        {
          const { timestamp: uploadTimestamp } = announcement;
          logSyncDebug({
            message: buildMessage(SyncLoggerStep.Upload, "Success"),
            details: {
              step: SyncLoggerStep.Upload,
              Timestamp: uploadTimestamp,
            },
          });
        }
        break;
      case "UploadFailed":
        {
          const { error } = announcement;
          logSyncWarn({
            message: buildMessage(SyncLoggerStep.Upload, "Error"),
            details: {
              step: SyncLoggerStep.Upload,
              Cause: getErrorMessage(error),
            },
          });
        }
        break;
      case "SaveStarted":
        logSyncVerbose({
          message: buildMessage(SyncLoggerStep.Save, "Start"),
          details: {
            step: SyncLoggerStep.Save,
          },
        });
        break;
      case "SaveFinished":
        logSyncVerbose({
          message: buildMessage(SyncLoggerStep.Save, "Done"),
          details: {
            step: SyncLoggerStep.Save,
          },
        });
        break;
      case "ChronologicalSyncFinished":
        {
          const { summarySize } = announcement;
          logSyncDebug({
            message: buildMessage(SyncLoggerStep.Chronological, "Done"),
            details: {
              step: SyncLoggerStep.Chronological,
              Summary: summarySize,
            },
          });
        }
        break;
      case "TreatProblemStarted":
        logSyncDebug({
          message: buildMessage(SyncLoggerStep.TreatProblem, "Start"),
          details: {
            step: SyncLoggerStep.TreatProblem,
          },
        });
        break;
      case "TreatProblemSummaryStarted":
        {
          const { localItemsCount, remoteItemsCount } = announcement;
          logSyncDebug({
            message: buildMessage(SyncLoggerStep.TreatProblemSummary, "Start"),
            details: {
              step: SyncLoggerStep.TreatProblemSummary,
              Local: localItemsCount,
              Remote: remoteItemsCount,
            },
          });
        }
        break;
      case "TreatProblemSummaryCompared":
        {
          const {
            result,
            cause,
            transactionType,
            identifier,
            localDate,
            remoteDate,
          } = announcement;
          const remoteDateProp =
            remoteDate !== undefined ? { RemoteDate: remoteDate } : {};
          const causeProp = cause
            ? { Cause: TreatProblemSummaryComparedCause[cause] }
            : {};
          const localDateProp = localDate ? { LocalDate: localDate } : {};
          logSyncDebug({
            message: buildMessage(
              SyncLoggerStep.TreatProblemSummary,
              "Comparison"
            ),
            details: {
              step: SyncLoggerStep.TreatProblemSummary,
              Result: TreatProblemSummaryComparedResult[result],
              ...causeProp,
              Type: transactionType,
              Id: identifier,
              ...localDateProp,
              ...remoteDateProp,
            },
          });
        }
        break;
      case "TreatProblemSummaryFinished":
        logSyncDebug({
          message: buildMessage(SyncLoggerStep.TreatProblemSummary, "Done"),
          details: {
            step: SyncLoggerStep.TreatProblemSummary,
          },
        });
        break;
      case "TreatProblemDiffComputed":
        {
          const { transactionsToDownloadCount, transactionsToUploadCount } =
            announcement;
          if (
            transactionsToDownloadCount === 0 &&
            transactionsToUploadCount === 0
          ) {
            logSyncVerbose({
              message: buildMessage(
                SyncLoggerStep.TreatProblem,
                "Diff UpToDate"
              ),
              details: {
                step: SyncLoggerStep.TreatProblem,
              },
            });
          } else {
            logSyncWarn({
              message: buildMessage(SyncLoggerStep.TreatProblem, "Diff"),
              details: {
                step: SyncLoggerStep.TreatProblem,
                Download: transactionsToDownloadCount,
                Upload: transactionsToUploadCount,
              },
            });
          }
        }
        break;
      case "TreatProblemFinished":
        logSyncDebug({
          message: buildMessage(SyncLoggerStep.TreatProblem, "Done"),
          details: {
            step: SyncLoggerStep.TreatProblem,
          },
        });
        break;
      case "TeamAdminDataSyncStarted":
        logSyncDebug({
          message: buildMessage(SyncLoggerStep.TeamAdminData, "Start"),
          details: {
            step: SyncLoggerStep.TeamAdminData,
          },
        });
        break;
      case "TeamAdminDataSyncFinished":
        logSyncDebug({
          message: buildMessage(SyncLoggerStep.TeamAdminData, "Done"),
          details: {
            step: SyncLoggerStep.TeamAdminData,
          },
        });
        break;
      case "SharingSyncStarted":
        logSyncDebug({
          message: buildMessage(SyncLoggerStep.Sharing, "Start"),
          details: {
            step: SyncLoggerStep.Sharing,
          },
        });
        break;
      case "SharingSyncFinished":
        logSyncDebug({
          message: buildMessage(SyncLoggerStep.Sharing, "Done"),
          details: {
            step: SyncLoggerStep.Sharing,
          },
        });
        break;
      case "SyncFinished":
        logSyncInfo({
          message: buildMessage(SyncLoggerStep.Main, "Done"),
          details: {
            step: SyncLoggerStep.Main,
          },
        });
        break;
      case "SyncFailed":
        {
          const { error } = announcement;
          logSyncError({
            message: buildMessage(SyncLoggerStep.Main, "Failed"),
            details: {
              step: SyncLoggerStep.Main,
              Cause: getErrorMessage(error),
            },
          });
        }
        break;
    }
  };
};
