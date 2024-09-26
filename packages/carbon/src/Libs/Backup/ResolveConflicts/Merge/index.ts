import { map, prop } from "ramda";
import { ChangeHistory } from "DataManagement/ChangeHistory/";
import { PersonalData } from "Session/Store/personalData/types";
import * as ChangeHistoryMerge from "Libs/Backup/ResolveConflicts/Merge/ChangeHistory";
import { findTransaction } from "Libs/Backup/Transactions/";
import type {
  ClearTransaction,
  TransactionType,
} from "Libs/Backup/Transactions/types";
import { UploadChange } from "Libs/Backup/Upload/UploadChange/";
export const unMergeableTransaction: string[] = [
  "DEFAULT_AUTHENTIFIANT",
  "DEFAULT_CONFIDENTIAL",
  "DEFAULT_IDENTITY",
  "DEFAULT_PAYMENTMEANS",
  "DEFAULT_MISC",
  "DEFAULT_REWARDCARD",
  "POINTS",
  "SETTINGS",
  "SECURITYALERTS",
] satisfies TransactionType[];
export const supportedTransactionTypesForMerge: string[] = [
  "DATA_CHANGE_HISTORY",
] satisfies TransactionType[];
export function getMergeableTransactions(
  remoteTransactions: ClearTransaction[],
  changesToUploadInConflict: UploadChange[]
): ClearTransaction[] {
  const idsInConflict = map(prop("itemId"), changesToUploadInConflict);
  return remoteTransactions
    .filter((t) => !unMergeableTransaction.includes(t.type))
    .filter((t) => t.action !== "BACKUP_REMOVE")
    .filter((t) => idsInConflict.includes(t.identifier))
    .filter((t) => supportedTransactionTypesForMerge.includes(t.type));
}
export interface MergeLocalAndRemoteResult {
  personalData: PersonalData;
  remoteTransactions: ClearTransaction[];
}
export function mergeLocalAndRemote(
  localPersonalData: PersonalData,
  remoteTransactions: ClearTransaction[]
): MergeLocalAndRemoteResult {
  const mergedRemoteTransaction: ClearTransaction[] = [];
  const mergedLocalChangeHistories = localPersonalData.changeHistories.map(
    (ch) => {
      const transaction = findTransaction(
        ch.Id,
        remoteTransactions
      ) as ClearTransaction;
      const mergedChangeHistory = ChangeHistoryMerge.mergeChangeHistories(
        ch,
        transaction.content as ChangeHistory
      );
      mergedRemoteTransaction.push({
        ...transaction,
        content: mergedChangeHistory,
      });
      return mergedChangeHistory;
    }
  );
  return {
    personalData: {
      ...localPersonalData,
      changeHistories: mergedLocalChangeHistories,
    },
    remoteTransactions: mergedRemoteTransaction,
  };
}
