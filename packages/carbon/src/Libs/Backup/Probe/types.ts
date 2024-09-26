import { ErrorName, Trigger } from "@dashlane/hermes";
import type { SyncType } from "Libs/Backup/types";
import { Announce, AnnouncementContext, Monitor } from "Libs/Probe";
export type AnnounceSync = Announce<SyncAnnouncementTypes>;
export type MonitorSync = Monitor<SyncAnnouncementTypes>;
export type SyncAnnouncementContext = AnnouncementContext;
export interface SyncStarted {
  type: "SyncStarted";
  trigger: Trigger;
  syncType: SyncType;
}
export interface ChronologicalSyncStarted {
  type: "ChronologicalSyncStarted";
  updatesCount: number;
  deletesCount: number;
}
export interface ChronologicalSyncFinished {
  type: "ChronologicalSyncFinished";
  summarySize: number;
  fullBackupFileSize?: number;
}
export interface ChronologicalSyncFailed {
  type: "ChronologicalSyncFailed";
  error: unknown;
}
export interface TreatProblemStarted {
  type: "TreatProblemStarted";
}
export interface TreatProblemFinished {
  type: "TreatProblemFinished";
}
export interface TreatProblemDiffComputed {
  type: "TreatProblemDiffComputed";
  transactionsToDownloadCount: number;
  transactionsToUploadCount: number;
}
export interface TreatProblemFailed {
  type: "TreatProblemFailed";
  error: unknown;
}
export interface TreatSharingKeysFailed {
  type: "TreatSharingKeysFailed";
  error: unknown;
}
export interface SharingSyncStarted {
  type: "SharingSyncStarted";
}
export interface SharingSyncFinished {
  type: "SharingSyncFinished";
}
export interface SharingSyncInvalidSyncData {
  type: "SharingSyncInvalidSyncData";
  itemGroupId: string;
  errorName: ErrorName;
}
export interface SharingSyncFailed {
  type: "SharingSyncFailed";
  error: unknown;
}
export interface TeamAdminDataSyncStarted {
  type: "TeamAdminDataSyncStarted";
}
export interface TeamAdminDataSyncFinished {
  type: "TeamAdminDataSyncFinished";
}
export interface TeamAdminDataSyncFailed {
  type: "TeamAdminDataSyncFailed";
  error: unknown;
}
export interface LatestRequested {
  type: "LatestRequested";
  lock: boolean;
  needsKeys: boolean;
}
export interface LatestSucceeded {
  type: "LatestSucceeded";
  updatesCount: number;
  deletesCount: number;
  fullBackupSize: number;
}
export interface LatestFailed {
  type: "LatestFailed";
  error: unknown;
}
export interface DecipherStarted {
  type: "DecipherStarted";
  fullBackupFileSize: number;
}
export interface DecipherFinished {
  type: "DecipherFinished";
  updatesCount: number;
  deletesCount: number;
}
export interface DecipherTransactionsStarted {
  type: "DecipherTransactionsStarted";
}
export interface DecipherTransactionsFinished {
  type: "DecipherTransactionsFinished";
}
export interface SyncFinished {
  type: "SyncFinished";
}
export interface SyncFailed {
  type: "SyncFailed";
  error: unknown;
}
export interface SyncTypeChanged {
  type: "SyncTypeChanged";
  syncType: SyncType;
}
export interface UploadRequested {
  type: "UploadRequested";
  updatedCount: number;
  deletedCount: number;
}
export interface UploadSucceeded {
  type: "UploadSucceeded";
  updatedCount: number;
  deletedCount: number;
  timestamp: number;
}
export interface UploadFailed {
  type: "UploadFailed";
  error: unknown;
}
export interface CipherStarted {
  type: "CipherStarted";
}
export interface TransactionCiphered {
  type: "TransactionCiphered";
  transactionType: string;
  itemId: string;
  backupDate: number;
}
export interface CipherFinished {
  type: "CipherFinished";
}
export interface DecipherFullBackupSkipped {
  type: "DecipherFullBackupSkipped";
}
export interface DecipherFullBackupStarted {
  type: "DecipherFullBackupStarted";
}
export interface DecipherFullBackupParseFailed {
  type: "DecipherFullBackupParseFailed";
  error: unknown;
}
export interface DecipherFullBackupDecipherFailed {
  type: "DecipherFullBackupDecipherFailed";
  error: unknown;
  cryptoPayload: string;
}
export interface DecipherFullBackupItemRead {
  type: "DecipherFullBackupItemRead";
  itemType: string;
  itemId: string;
  backupDate: number;
}
export interface DecipherFullBackupItemSkipped {
  type: "DecipherFullBackupItemSkipped";
  itemType: string;
  itemId?: string;
  error: Error;
}
export interface DecipherFullBackupItemReadFailed {
  type: "DecipherFullBackupItemReadFailed";
  error: unknown;
  itemId: string;
}
export interface DecipherFullBackupFailed {
  type: "DecipherFullBackupFailed";
  error: unknown;
}
export interface DecipherFullBackupFinished {
  type: "DecipherFullBackupFinished";
  itemsCount: number;
}
export interface DecipherTransactionStarted {
  type: "DecipherTransactionStarted";
  action: "BACKUP_EDIT" | "BACKUP_REMOVE";
  transactionType: string;
  identifier: string;
  backupDate: number;
  time: number;
}
export interface DecipherTransactionDecipherFailed {
  type: "DecipherTransactionDecipherFailed";
  error: unknown;
  cryptoPayload: string;
}
export interface DecipherTransactionParseFailed {
  type: "DecipherTransactionParseFailed";
  error: unknown;
}
export interface DecipherTransactionFailed {
  type: "DecipherTransactionFailed";
  error: unknown;
  transactionType: string;
  identifier: string;
  backupDate: number;
}
export interface DecipherTransactionFinished {
  type: "DecipherTransactionFinished";
  action: "BACKUP_EDIT" | "BACKUP_REMOVE";
  transactionType: string;
  identifier: string;
  backupDate: number;
}
export interface TransactionDuplicated {
  type: "TransactionDuplicated";
  transactionType: string;
  identifier: string;
  backupDate: number;
}
export interface TreatProblemSummaryStarted {
  type: "TreatProblemSummaryStarted";
  localItemsCount: number;
  remoteItemsCount: number;
}
export enum TreatProblemSummaryComparedResult {
  UpToDate,
  Upload,
  Download,
}
export enum TreatProblemSummaryComparedCause {
  OutOfDate,
  Missing,
}
export interface TreatProblemSummaryCompared {
  type: "TreatProblemSummaryCompared";
  result: TreatProblemSummaryComparedResult;
  cause?: TreatProblemSummaryComparedCause;
  transactionType: string;
  identifier: string;
  localDate?: number;
  remoteDate?: number;
}
export interface TreatProblemSummaryFinished {
  type: "TreatProblemSummaryFinished";
}
export interface SaveStarted {
  type: "SaveStarted";
}
export interface SaveFinished {
  type: "SaveFinished";
}
export type SyncAnnouncementTypes =
  | SyncStarted
  | ChronologicalSyncStarted
  | ChronologicalSyncFailed
  | ChronologicalSyncFinished
  | LatestRequested
  | LatestSucceeded
  | LatestFailed
  | DecipherStarted
  | DecipherFinished
  | DecipherTransactionsStarted
  | DecipherTransactionsFinished
  | TreatProblemStarted
  | TreatProblemFailed
  | TreatProblemDiffComputed
  | TreatProblemSummaryStarted
  | TreatProblemSummaryCompared
  | TreatProblemSummaryFinished
  | TransactionDuplicated
  | TreatProblemFinished
  | TreatSharingKeysFailed
  | SharingSyncStarted
  | SharingSyncInvalidSyncData
  | SharingSyncFailed
  | SharingSyncFinished
  | TeamAdminDataSyncStarted
  | TeamAdminDataSyncFailed
  | TeamAdminDataSyncFinished
  | SyncTypeChanged
  | UploadRequested
  | UploadSucceeded
  | UploadFailed
  | CipherStarted
  | TransactionCiphered
  | CipherFinished
  | DecipherFullBackupSkipped
  | DecipherFullBackupStarted
  | DecipherFullBackupDecipherFailed
  | DecipherFullBackupParseFailed
  | DecipherFullBackupItemReadFailed
  | DecipherFullBackupItemSkipped
  | DecipherFullBackupItemRead
  | DecipherFullBackupFailed
  | DecipherFullBackupFinished
  | DecipherTransactionStarted
  | DecipherTransactionDecipherFailed
  | DecipherTransactionParseFailed
  | DecipherTransactionFailed
  | DecipherTransactionFinished
  | SaveStarted
  | SaveFinished
  | SyncFinished
  | SyncFailed;
