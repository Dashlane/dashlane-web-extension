import { v4 as uuidv4 } from "uuid";
import { defaultTo } from "ramda";
import { AuthenticationCode } from "@dashlane/communication";
import type {
  ClearTransaction,
  Transaction,
} from "Libs/Backup/Transactions/types";
import {
  FullBackupFileListItem,
  KeyPair,
  SyncSummary,
  WSLatestParams,
  WSLatestResult,
} from "Libs/WS/Backup/types";
import * as BackupCrypt from "Libs/Backup/BackupCrypt";
import Debugger from "Logs/Debugger";
import { Sharing2Summary } from "Session/Store/sharingData/types";
import { SyncArgs, SyncType } from "Libs/Backup/types";
import { announcements } from "Libs/Backup/Probe";
import { unlock } from "Libs/Backup/unlock";
import { CarbonError } from "Libs/Error";
import { sendExceptionLog } from "Logs/Exception";
export interface LatestResults {
  clearTransactions?: ClearTransaction[];
  sharing2?: Sharing2Summary;
  lastSyncTimestamp: number;
  lock: string;
  syncType?: SyncType;
  keys?: KeyPair;
  isUploadEnabled: boolean;
  summary?: SyncSummary;
  fullBackupFileSize?: number;
}
export async function latest(args: SyncArgs): Promise<LatestResults> {
  const wsLatestArgs = buildLatestArgs(args);
  const { announce } = args;
  let result: WSLatestResult | undefined;
  try {
    const { lock, needsKeys } = wsLatestArgs;
    announce(announcements.latestRequested(lock, needsKeys));
    result = await args.ws.backup.latest(wsLatestArgs);
    if (result.objectType === "message") {
      if (result.content === "Incorrect authentification") {
        throw new Error(AuthenticationCode[AuthenticationCode.INVALID_UKI]);
      } else if (result.content === "Temporarily disabled") {
        throw new Error("Sync service unavailable");
      } else {
        throw new Error(
          AuthenticationCode[AuthenticationCode.UNKNOWN_SYNC_ERROR]
        );
      }
    }
    if (result.objectType !== undefined) {
      throw new Error("unexpected objectType");
    }
    if (!result.transactionList) {
      Debugger.log("Backup sync failed");
      throw new Error("Backup sync failed");
    }
    if (!areTransactionsCorrect(result.transactionList)) {
      throw new Error("wrongly formatted backupDate");
    }
  } catch (error) {
    announce(announcements.latestFailed(error));
    throw error;
  }
  announce(announcements.latestSucceeded(result));
  const fullBackupFileMap = buildFullBackupFileMap(result.fullBackupFileList);
  try {
    const clearTransactions = await BackupCrypt.decrypt(
      args.dataEncryptorService.getInstance(),
      announce,
      result.fullBackupFile,
      fullBackupFileMap,
      result.transactionList
    );
    const latestResult: LatestResults = {
      clearTransactions,
      sharing2: result.sharing2,
      lastSyncTimestamp: result.timestamp,
      lock: wsLatestArgs.lock,
      keys: result.keys,
      isUploadEnabled: defaultTo(false, result.uploadEnabled),
      summary: result.summary,
      fullBackupFileSize: fullBackupFileMap.size,
    };
    return latestResult;
  } catch (error) {
    unlock(args, wsLatestArgs.lock);
    throw error;
  }
}
export function buildLatestArgs(args: SyncArgs): WSLatestParams {
  const {
    lastSyncTimestamp,
    login,
    needsKeys,
    storeService,
    syncType,
    transactionIds,
    uki,
  } = args;
  const isTreatProblem = transactionIds && transactionIds.length;
  const lock =
    syncType === SyncType.FULL_SYNC || isTreatProblem ? uuidv4() : "nolock";
  const latestParams: WSLatestParams = {
    lock,
    login,
    needsKeys,
    sharing2: true,
    teamAdminGroups: true,
    timestamp: lastSyncTimestamp,
    version: storeService.getPlatform().info.appVersion,
    uki,
  };
  if (transactionIds) {
    latestParams.transactions = transactionIds;
  }
  switch (syncType) {
    case SyncType.FIRST_SYNC:
      if (latestParams.timestamp !== 0) {
        throw new Error("timestamp should be null for FIRST_SYNC");
      }
      break;
    case SyncType.LIGHT_SYNC:
    case SyncType.FULL_SYNC:
      if (isNaN(latestParams.timestamp)) {
        latestParams.timestamp = 0;
      } else if (
        latestParams.timestamp === null ||
        latestParams.timestamp < 999999999999 ||
        latestParams.timestamp > 2070753783000
      ) {
        const error = new Error("non valid lastSyncTimestamp");
        const augmentedError = CarbonError.fromAnyError(error)
          .addContextInfo("SYNC", "buildLatestArgs")
          .addAdditionalInfo({
            libError: `lastSyncTimestamp: ${latestParams.timestamp}`,
          });
        sendExceptionLog({ error: augmentedError });
        throw error;
      }
      break;
    default: {
      const error = new Error("unexpected syncType");
      const augmentedError = CarbonError.fromAnyError(error)
        .addContextInfo("SYNC", "buildLatestArgs")
        .addAdditionalInfo({
          libError: `syncType: ${syncType}`,
        });
      sendExceptionLog({ error: augmentedError });
      throw error;
    }
  }
  return latestParams;
}
function areTransactionsCorrect(transactionList: Transaction[]): boolean {
  const wrongTimestampTransaction = transactionList.find(
    (transaction: Transaction) => {
      return (
        !transaction.backupDate ||
        transaction.backupDate < 999999999999 ||
        transaction.backupDate > 2070753783000
      );
    }
  );
  if (wrongTimestampTransaction) {
    return false;
  }
  return true;
}
export function buildFullBackupFileMap(
  fullBackupFileList: FullBackupFileListItem[]
) {
  const fullBackupFileMap = new Map<string, number>();
  if (fullBackupFileList) {
    fullBackupFileList.forEach((backupFileItem) => {
      fullBackupFileMap.set(
        backupFileItem.identifier,
        backupFileItem.backupDate
      );
    });
  }
  return fullBackupFileMap;
}
