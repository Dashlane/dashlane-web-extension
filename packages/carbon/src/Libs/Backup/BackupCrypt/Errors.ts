import {
  ErrorMessages,
  ErrorType,
  LibErrorAdditionalInfo,
} from "Libs/Error/types";
import { CarbonError, isCarbonError } from "Libs/Error";
export enum BackupCryptErrorCode {
  TRANSACTION_CLEAR_CONTENT_EMPTY,
  EMPTY_CLEAR_FULL_BACKUP_FILE_XML,
  CLEAR_FULL_BACKUP_FILE_XML_NOT_AN_ARRAY,
  EMPTY_FULL_BACKUP_FILE,
  NULL_FULL_BACKUP_FILE_MAP,
  EMPTY_FULL_BACKUP_FILE_MAP,
  EMPTY_CLEAR_FULL_BACKUP_FILE,
  CLEAR_FULL_BACKUP_FILE_NOT_XML,
  FULL_BACKUP_FILE_ITEM_WITHOUT_KWTYPE,
  FULL_BACKUP_FILE_ITEM_WITHOUT_ID,
  TRANSACTION_CONTENT_NOT_XML,
}
export const BackupCryptErrorMessages: ErrorMessages = {
  [BackupCryptErrorCode.TRANSACTION_CLEAR_CONTENT_EMPTY]:
    "Empty transaction content",
  [BackupCryptErrorCode.EMPTY_CLEAR_FULL_BACKUP_FILE_XML]:
    "Empty full backup file XML",
  [BackupCryptErrorCode.CLEAR_FULL_BACKUP_FILE_XML_NOT_AN_ARRAY]:
    "Full backup file XML not resolved as an array",
  [BackupCryptErrorCode.EMPTY_FULL_BACKUP_FILE]: "Empty full backup file",
  [BackupCryptErrorCode.NULL_FULL_BACKUP_FILE_MAP]: "Null full backup file map",
  [BackupCryptErrorCode.EMPTY_FULL_BACKUP_FILE_MAP]:
    "Empty full backup file map",
  [BackupCryptErrorCode.EMPTY_CLEAR_FULL_BACKUP_FILE]:
    "Deciphered full backup file content is empty",
  [BackupCryptErrorCode.CLEAR_FULL_BACKUP_FILE_NOT_XML]: "WRONG_PASSWORD",
  [BackupCryptErrorCode.FULL_BACKUP_FILE_ITEM_WITHOUT_KWTYPE]:
    "Full backup file item without kwType",
  [BackupCryptErrorCode.FULL_BACKUP_FILE_ITEM_WITHOUT_ID]:
    "Full backup file item without Id",
  [BackupCryptErrorCode.TRANSACTION_CONTENT_NOT_XML]: "WRONG_PASSWORD",
};
export const BackupCryptError: ErrorType = {
  codes: BackupCryptErrorCode,
  name: "BackupCryptError",
  messages: BackupCryptErrorMessages,
};
export interface BackupCryptErrorAdditionalInfo extends LibErrorAdditionalInfo {
  itemId?: string;
  transactionType?: string;
  itemKeys?: string[];
  action?: string;
  backupDate?: number;
}
export type BackupCryptError = CarbonError<
  BackupCryptErrorCode,
  BackupCryptErrorAdditionalInfo
>;
export const isBackupCryptError = (error: unknown): error is BackupCryptError =>
  isCarbonError<BackupCryptErrorCode, BackupCryptErrorAdditionalInfo>(
    error,
    BackupCryptError
  );
