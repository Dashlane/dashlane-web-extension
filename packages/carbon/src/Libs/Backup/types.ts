import type {
  ClearTransaction,
  Transaction,
} from "Libs/Backup/Transactions/types";
import { Sharing2Summary } from "Session/Store/sharingData/types";
import { KeyPair, SyncSummary } from "Libs/WS/Backup/types";
import { StoreService } from "Store";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { AnnounceSync } from "./Probe/types";
import { PersonalData } from "Session/Store/personalData/types";
import { WSService } from "Libs/WS";
import { ApplicationModulesAccess } from "@dashlane/communication";
export interface SyncArgs {
  storeService: StoreService;
  applicationModulesAccess?: ApplicationModulesAccess;
  dataEncryptorService: DataEncryptorService;
  announce: AnnounceSync;
  login: string;
  uki: string;
  lastSyncTimestamp: number;
  personalData?: PersonalData;
  ws: WSService;
  syncType: SyncType;
  needsKeys: boolean;
  pushKeysToServer?: {
    public: string;
    private: string;
  };
  transactionIds?: string[];
}
export enum SyncType {
  FIRST_SYNC,
  LIGHT_SYNC,
  FULL_SYNC,
}
export interface BackupResults {
  token?: string;
  clearTransactions?: ClearTransaction[];
  firstSyncData?: {
    fullBackupFile?: string;
    fullBackupFileMap?: Map<string, number>;
    transactionList?: Transaction[];
    serverKey?: string;
  };
  sharing2?: Sharing2Summary;
  uploadedTransactions: string[];
  lastSyncTimestamp: number;
  syncType?: SyncType;
  keys?: KeyPair;
  isUploadEnabled: boolean;
  summary: SyncSummary;
  fullBackupFileSize?: number;
}
