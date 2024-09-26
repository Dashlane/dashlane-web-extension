import { BaseDataModelObject } from "@dashlane/communication";
import type {
  ClearTransaction,
  Transaction,
} from "Libs/Backup/Transactions/types";
import {
  attemptReadCryptoPayload,
  fixKwType,
} from "Libs/Backup/BackupCrypt/utils";
import {
  BackupCryptError,
  BackupCryptErrorCode,
  isBackupCryptError,
} from "Libs/Backup/BackupCrypt/Errors";
import { OpenSessionProgressService } from "Libs/Backup/BackupCrypt/openSessionProgressService";
import { CarbonError } from "Libs/Error";
import { parseDashlaneXml } from "Libs/XML";
import * as Exception from "Logs/Exception";
import { deflatedUtf8ToUtf16, utf16ToDeflatedUtf8 } from "Libs/CryptoCenter";
import { CryptoCenterService, EncryptOptions } from "Libs/CryptoCenter/types";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { announcements, AnnounceSync } from "Libs/Backup/Probe";
export const decryptTransactionContent = async (
  cryptoService: CryptoCenterService,
  announce: AnnounceSync,
  { content }: Transaction
): Promise<string> => {
  try {
    const bytes = await cryptoService.decrypt(content);
    return deflatedUtf8ToUtf16(bytes);
  } catch (error) {
    const cryptoPayload = attemptReadCryptoPayload(cryptoService, content);
    announce(
      announcements.decipherTransactionDecipherFailed(error, cryptoPayload)
    );
    throw error;
  }
};
const checkContentIsNotEmpty = (clearTransactionContent: string): void => {
  if (!clearTransactionContent) {
    const error = new CarbonError(
      BackupCryptError,
      BackupCryptErrorCode.TRANSACTION_CLEAR_CONTENT_EMPTY
    );
    Exception.sendExceptionLog({ error });
    throw error;
  }
};
const checkContentStartsWithBracket = (
  clearTransactionContent: string
): void => {
  if (
    typeof clearTransactionContent === "string" &&
    !clearTransactionContent.trim().startsWith("<")
  ) {
    throw new CarbonError(
      BackupCryptError,
      BackupCryptErrorCode.TRANSACTION_CONTENT_NOT_XML
    );
  }
};
export const parseTransactionContentXml = async (
  announce: AnnounceSync,
  clearTransactionContent: string
): Promise<object> => {
  try {
    checkContentIsNotEmpty(clearTransactionContent);
    checkContentStartsWithBracket(clearTransactionContent);
    return (await parseDashlaneXml(clearTransactionContent)) as object;
  } catch (error) {
    announce(announcements.decipherTransactionParseFailed(error));
    throw error;
  }
};
const makeClearTransaction = (
  transaction: Transaction,
  clearContent: BaseDataModelObject
): ClearTransaction => {
  return Object.assign({}, transaction, { content: clearContent });
};
export async function decryptSingleTransaction(
  cryptoService: CryptoCenterService,
  announce: AnnounceSync,
  transaction: Transaction
): Promise<ClearTransaction | null> {
  try {
    announce(announcements.decipherTransactionStarted(transaction));
    const clearContentStr = await decryptTransactionContent(
      cryptoService,
      announce,
      transaction
    );
    const xml = await parseTransactionContentXml(announce, clearContentStr);
    const fixedClearContent = fixKwType(xml) as BaseDataModelObject;
    const clearTransaction = makeClearTransaction(
      transaction,
      fixedClearContent
    );
    announce(announcements.decipherTransactionFinished(transaction));
    return clearTransaction;
  } catch (error) {
    const { type } = transaction;
    if (isBackupCryptError(error)) {
      const { action, backupDate, identifier } = transaction;
      error.addAdditionalInfo({
        itemId: identifier,
        transactionType: type,
        action,
        backupDate,
      });
    }
    announce(announcements.decipherTransactionFailed(error, transaction));
    if (type === "SETTINGS") {
      throw error;
    }
    return null;
  }
}
export async function decryptSingleTransactions(
  cryptoService: CryptoCenterService,
  announce: AnnounceSync,
  transactions: Transaction[],
  progressService?: OpenSessionProgressService
): Promise<ClearTransaction[]> {
  const promises = transactions.map(async (transaction) => {
    const clearTransaction = await decryptSingleTransaction(
      cryptoService,
      announce,
      transaction
    );
    if (progressService) {
      progressService.incrementJobsDone();
    }
    return clearTransaction;
  });
  const clearTransactions = await Promise.all(promises);
  return clearTransactions.filter(Boolean);
}
export async function encryptSingleTransaction<T extends Transaction>(
  dataEncryptorService: DataEncryptorService,
  clearTransaction: T,
  encryptOptions: EncryptOptions = {}
): Promise<T> {
  const bytes = utf16ToDeflatedUtf8(clearTransaction.content);
  const encryptedData = await dataEncryptorService
    .getInstance()
    .encrypt(bytes, encryptOptions);
  return {
    ...clearTransaction,
    content: encryptedData,
  };
}
