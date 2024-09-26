import { ErrorName, Trigger } from "@dashlane/hermes";
import type {
  ClearTransaction,
  Transaction,
} from "Libs/Backup/Transactions/types";
import type { SyncType } from "Libs/Backup/types";
import {
  SyncAnnouncementTypes,
  TreatProblemSummaryComparedCause,
  TreatProblemSummaryComparedResult,
} from "Libs/Backup/Probe/types";
import { countSyncSummaryTransactions } from "Libs/Backup/helpers";
import { PersonalData } from "Session/Store/personalData/types";
import { SyncSummary, WSLatestResult } from "Libs/WS/Backup/types";
import {
  countEditionTransactions,
  countRemoveTransactions,
} from "Libs/Backup/Transactions/utils";
import { countPersonalDataItems } from "Session/Store/personalData";
import {
  countDeletionUploadChanges,
  countEditionUploadChanges,
} from "Libs/Backup/Upload/UploadChange";
export const syncStarted = (
  trigger: Trigger,
  syncType: SyncType
): SyncAnnouncementTypes => ({
  type: "SyncStarted",
  trigger,
  syncType,
});
export const chronologicalSyncStarted = (
  personalData: PersonalData
): SyncAnnouncementTypes => ({
  type: "ChronologicalSyncStarted",
  updatesCount: countEditionUploadChanges(personalData?.changesToUpload || []),
  deletesCount: countDeletionUploadChanges(personalData?.changesToUpload || []),
});
export const chronologicalSyncFailed = (
  error: unknown
): SyncAnnouncementTypes => ({
  type: "ChronologicalSyncFailed",
  error,
});
export const chronologicalSyncFinished = (
  summary: SyncSummary,
  fullBackupFileSize?: number
): SyncAnnouncementTypes => ({
  type: "ChronologicalSyncFinished",
  summarySize: countSyncSummaryTransactions(summary),
  fullBackupFileSize,
});
export const treatProblemStarted = (): SyncAnnouncementTypes => ({
  type: "TreatProblemStarted",
});
export const treatProblemFailed = (error: unknown): SyncAnnouncementTypes => ({
  type: "TreatProblemFailed",
  error,
});
export const treatProblemDiffComputed = (
  transactionsToDownloadCount: number,
  transactionsToUploadCount: number
): SyncAnnouncementTypes => ({
  type: "TreatProblemDiffComputed",
  transactionsToDownloadCount,
  transactionsToUploadCount,
});
export const treatProblemFinished = (): SyncAnnouncementTypes => ({
  type: "TreatProblemFinished",
});
export const treatSharingKeysFailed = (
  error: unknown
): SyncAnnouncementTypes => ({
  type: "TreatSharingKeysFailed",
  error,
});
export const sharingSyncStarted = (): SyncAnnouncementTypes => ({
  type: "SharingSyncStarted",
});
export const sharingSyncInvalidSyncData = (
  itemGroupId: string,
  errorName: ErrorName
): SyncAnnouncementTypes => ({
  type: "SharingSyncInvalidSyncData",
  itemGroupId,
  errorName,
});
export const sharingSyncFailed = (error: unknown): SyncAnnouncementTypes => ({
  type: "SharingSyncFailed",
  error,
});
export const sharingSyncFinished = (): SyncAnnouncementTypes => ({
  type: "SharingSyncFinished",
});
export const teamAdminDataSyncStarted = (): SyncAnnouncementTypes => ({
  type: "TeamAdminDataSyncStarted",
});
export const teamAdminDataSyncFailed = (
  error: unknown
): SyncAnnouncementTypes => ({
  type: "TeamAdminDataSyncFailed",
  error,
});
export const teamAdminDataSyncFinished = (): SyncAnnouncementTypes => ({
  type: "TeamAdminDataSyncFinished",
});
export const latestRequested = (
  lock: string,
  needsKeys: boolean
): SyncAnnouncementTypes => ({
  type: "LatestRequested",
  lock: lock !== "nolock",
  needsKeys,
});
export const latestSucceeded = (
  result: WSLatestResult
): SyncAnnouncementTypes => ({
  type: "LatestSucceeded",
  updatesCount: countEditionTransactions(result.transactionList),
  deletesCount: countRemoveTransactions(result.transactionList),
  fullBackupSize: (result.fullBackupFileList || []).length,
});
export const latestFailed = (error: unknown): SyncAnnouncementTypes => ({
  type: "LatestFailed",
  error,
});
export const decipherStarted = (
  fullBackupFileSize: number
): SyncAnnouncementTypes => ({
  type: "DecipherStarted",
  fullBackupFileSize,
});
export const decipherFinished = (
  transactions: ClearTransaction[]
): SyncAnnouncementTypes => ({
  type: "DecipherFinished",
  updatesCount: countEditionTransactions(transactions),
  deletesCount: countRemoveTransactions(transactions),
});
export const decipherTransactionsStarted = (): SyncAnnouncementTypes => ({
  type: "DecipherTransactionsStarted",
});
export const decipherTransactionsFinished = (): SyncAnnouncementTypes => ({
  type: "DecipherTransactionsFinished",
});
export const syncFinished = (): SyncAnnouncementTypes => ({
  type: "SyncFinished",
});
export const syncFailed = (error: unknown): SyncAnnouncementTypes => ({
  type: "SyncFailed",
  error,
});
export const syncTypeChanged = (syncType: SyncType): SyncAnnouncementTypes => ({
  type: "SyncTypeChanged",
  syncType,
});
export const uploadRequested = (
  updatedCount: number,
  deletedCount: number
): SyncAnnouncementTypes => ({
  type: "UploadRequested",
  updatedCount,
  deletedCount,
});
export const uploadSucceeded = (
  updatedCount: number,
  deletedCount: number,
  timestamp: number
): SyncAnnouncementTypes => ({
  type: "UploadSucceeded",
  updatedCount,
  deletedCount,
  timestamp,
});
export const uploadFailed = (error: unknown): SyncAnnouncementTypes => ({
  type: "UploadFailed",
  error,
});
export const cipherStarted = (): SyncAnnouncementTypes => ({
  type: "CipherStarted",
});
export const transactionCiphered = (
  transactionType: string,
  itemId: string,
  backupDate: number
): SyncAnnouncementTypes => ({
  type: "TransactionCiphered",
  transactionType,
  itemId,
  backupDate,
});
export const cipherFinished = (): SyncAnnouncementTypes => ({
  type: "CipherFinished",
});
export const decipherFullBackupSkipped = (): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupSkipped",
});
export const decipherFullBackupStarted = (): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupStarted",
});
export const decipherFullBackupParseFailed = (
  error: unknown
): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupParseFailed",
  error,
});
export const decipherFullBackupDecipherFailed = (
  error: unknown,
  cryptoPayload: string
): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupDecipherFailed",
  error,
  cryptoPayload,
});
export const decipherFullBackupItemRead = (
  itemType: string,
  itemId: string,
  backupDate: number
): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupItemRead",
  itemType,
  itemId,
  backupDate,
});
export const decipherFullBackupItemSkipped = (
  error: Error,
  details?: {
    itemId?: string;
    itemType?: string;
  }
): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupItemSkipped",
  itemType: details?.itemType,
  itemId: details?.itemId,
  error,
});
export const decipherFullBackupItemReadFailed = (
  error: unknown,
  itemId: string
): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupItemReadFailed",
  error,
  itemId,
});
export const decipherFullBackupFailed = (
  error: unknown
): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupFailed",
  error,
});
export const decipherFullBackupFinished = (
  itemsCount: number
): SyncAnnouncementTypes => ({
  type: "DecipherFullBackupFinished",
  itemsCount,
});
export const decipherTransactionStarted = ({
  action,
  backupDate,
  identifier,
  time,
  type,
}: Transaction): SyncAnnouncementTypes => ({
  type: "DecipherTransactionStarted",
  time,
  action,
  backupDate,
  identifier,
  transactionType: type,
});
export const decipherTransactionDecipherFailed = (
  error: unknown,
  cryptoPayload: string
): SyncAnnouncementTypes => ({
  type: "DecipherTransactionDecipherFailed",
  error,
  cryptoPayload,
});
export const decipherTransactionParseFailed = (
  error: unknown
): SyncAnnouncementTypes => ({
  type: "DecipherTransactionParseFailed",
  error,
});
export const decipherTransactionFailed = (
  error: unknown,
  { backupDate, identifier, type }: Transaction
): SyncAnnouncementTypes => ({
  type: "DecipherTransactionFailed",
  error,
  transactionType: type,
  identifier,
  backupDate,
});
export const decipherTransactionFinished = ({
  action,
  backupDate,
  identifier,
  type,
}: Transaction): SyncAnnouncementTypes => ({
  type: "DecipherTransactionFinished",
  action,
  transactionType: type,
  identifier,
  backupDate,
});
export const transactionDuplicated = (
  transactionType: string,
  identifier: string,
  backupDate: number
): SyncAnnouncementTypes => ({
  type: "TransactionDuplicated",
  transactionType,
  identifier,
  backupDate,
});
export const treatProblemSummaryStarted = (
  personalData: PersonalData,
  summary: SyncSummary
): SyncAnnouncementTypes => ({
  type: "TreatProblemSummaryStarted",
  localItemsCount: countPersonalDataItems(personalData),
  remoteItemsCount: countSyncSummaryTransactions(summary),
});
export const treatProblemSummaryCompared = (
  result: TreatProblemSummaryComparedResult,
  transactionType: string,
  identifier: string,
  options?: {
    cause?: TreatProblemSummaryComparedCause;
    localDate?: number;
    remoteDate?: number;
  }
): SyncAnnouncementTypes => ({
  type: "TreatProblemSummaryCompared",
  result,
  transactionType,
  identifier,
  ...(options?.cause ? { cause: options.cause } : {}),
  ...(options?.localDate ? { localDate: options.localDate } : {}),
  ...(options?.remoteDate ? { remoteDate: options.remoteDate } : {}),
});
export const treatProblemSummaryFinished = (): SyncAnnouncementTypes => ({
  type: "TreatProblemSummaryFinished",
});
export const saveStarted = (): SyncAnnouncementTypes => ({
  type: "SaveStarted",
});
export const saveFinished = (): SyncAnnouncementTypes => ({
  type: "SaveFinished",
});
