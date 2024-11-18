import { TransactionType } from "@dashlane/communication";
import { Transaction } from "Libs/Backup/Transactions/types";
import { Sharing2Summary } from "Session/Store/sharingData/types";
export interface WSBackup {
  latest: (params: WSLatestParams) => Promise<WSLatestResult>;
  upload: (params: WSUploadParams) => Promise<WSUploadResult>;
  unlock: (params: WSUnlockParams) => Promise<void>;
  erase: (params: WSEraseParams) => Promise<WSEraseResult>;
}
export type LatestParam = WSLatestParams;
export type LatestResult = WSLatestResult;
export type UploadParams = WSUploadParams;
export type UploadResult = WSUploadResult;
export interface SyncSummary {
  transactions: {
    [k in TransactionType]?: {
      [k: string]: number;
    };
  };
}
export interface WSLatestResult {
  fullBackupFile?: string;
  fullBackupFileList?: FullBackupFileListItem[];
  transactionList?: Transaction[];
  timestamp?: number;
  objectType?: string;
  content?: string;
  keys?: KeyPair;
  sharing2?: Sharing2Summary;
  uploadEnabled: boolean;
  summary?: SyncSummary;
}
export type SyncLock = "nolock" | string;
export interface KeyPair {
  privateKey?: string;
  publicKey?: string;
}
export interface WSLatestParams {
  lock: SyncLock;
  login: string;
  needsKeys?: boolean;
  sharing2?: boolean;
  teamAdminGroups?: boolean;
  timestamp: number;
  version?: string;
  uki?: string;
  transactions?: string[];
}
export interface FullBackup {
  transactions: FullBackupFileListItem[];
  content: string;
}
export interface FullBackupFileListItem {
  identifier: string;
  backupDate: number;
}
export interface WSUploadParams {
  login: string;
  uki: string;
  lock: SyncLock;
  transactions: Transaction[];
  publicKey?: string;
  privateKey?: string;
}
export interface WSUploadResult {
  objectType?: string;
  content?: string;
  timestamp?: number;
  numberTransactions?: string;
  summary: SyncSummary;
}
export interface WSUnlockParams {
  lock: string;
  login: string;
  uki?: string;
}
export interface WSEraseParams {
  login: string;
  uki: string;
  lock: string;
  service: string;
  keepLock?: string;
  remoteIP?: string;
}
export interface WSEraseResult {
  objectType?: string;
  content?: string;
}
