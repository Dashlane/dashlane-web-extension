import { partition } from "ramda";
import type {
  ClearTransaction,
  Transaction,
} from "Libs/Backup/Transactions/types";
import { decryptFullBackupFile } from "Libs/Backup/BackupCrypt/fullBackupFile";
import {
  decryptSingleTransactions,
  encryptSingleTransaction,
} from "Libs/Backup/BackupCrypt/singleTransactions";
import { makeOpenSessionProgressService } from "Libs/Backup/BackupCrypt/openSessionProgressService";
import { CryptoCenterService } from "Libs/CryptoCenter/types";
import { announcements, AnnounceSync } from "Libs/Backup/Probe";
const partitionSettingsTransactionsLeft = (transactions: Transaction[]) =>
  partition((t) => t.type === "SETTINGS", transactions);
const partitionContentfulTransactionsLeft = (transactions: Transaction[]) =>
  partition((t) => !!t.content, transactions);
const makeContentlessClearTransactions = (
  transactions: Transaction[]
): ClearTransaction[] => transactions.map((t) => ({ ...t, content: null }));
export async function decrypt(
  cryptoService: CryptoCenterService,
  announce: AnnounceSync,
  fullBackupFile: string,
  fullBackupFileMap: Map<string, number>,
  transactionList: Transaction[]
): Promise<ClearTransaction[]> {
  if (transactionList === null) {
    throw new Error("null transactions");
  }
  const fullBackupFileSize = Number(fullBackupFile && fullBackupFileMap.size);
  announce(announcements.decipherStarted(fullBackupFileSize));
  const clearFullBackupFileTransactions = await decryptFullBackupFile(
    cryptoService,
    announce,
    fullBackupFile,
    fullBackupFileMap
  );
  announce(announcements.decipherTransactionsStarted());
  const [settingsTransactions, nonSettingsTransactions] =
    partitionSettingsTransactionsLeft(transactionList);
  const clearSettingsTransactions = await decryptSingleTransactions(
    cryptoService,
    announce,
    settingsTransactions
  );
  const [contentfulTransactions, contentlessTransactions] =
    partitionContentfulTransactionsLeft(nonSettingsTransactions);
  const progressService = makeOpenSessionProgressService();
  progressService.init(contentfulTransactions.length);
  const clearContentfulTransactions = await decryptSingleTransactions(
    cryptoService,
    announce,
    contentfulTransactions,
    progressService
  );
  const clearContentlessTransactions = makeContentlessClearTransactions(
    contentlessTransactions
  );
  announce(announcements.decipherTransactionsFinished());
  const clearTransactions = [
    ...clearFullBackupFileTransactions,
    ...clearSettingsTransactions,
    ...clearContentlessTransactions,
    ...clearContentfulTransactions,
  ];
  announce(announcements.decipherFinished(clearTransactions));
  return clearTransactions;
}
export { encryptSingleTransaction };
