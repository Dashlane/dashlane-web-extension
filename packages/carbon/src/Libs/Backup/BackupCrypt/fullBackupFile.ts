import { BaseDataModelObject } from "@dashlane/communication";
import { KWXMLElement } from "@dashlane/kw-xml";
import type { ClearTransaction } from "Libs/Backup/Transactions/types";
import {
  attemptReadCryptoPayload,
  fixKwType,
} from "Libs/Backup/BackupCrypt/utils";
import {
  BackupCryptError,
  BackupCryptErrorCode,
} from "Libs/Backup/BackupCrypt/Errors";
import { getTransactionTypeFromDataModelType } from "Libs/Backup/Transactions/types";
import { deflatedUtf8ToUtf16 } from "Libs/CryptoCenter";
import { CryptoCenterService } from "Libs/CryptoCenter/types";
import { CarbonError, isCarbonError } from "Libs/Error";
import { parseDashlaneXml } from "Libs/XML";
import * as Exception from "Logs/Exception";
import { announcements, AnnounceSync } from "Libs/Backup/Probe";
const parseFullBackupFileXml = async (
  announce: AnnounceSync,
  xmlString: string
): Promise<KWXMLElement[]> => {
  try {
    const parsedXml = (await parseDashlaneXml(xmlString)) as KWXMLElement[];
    if (!parsedXml) {
      throw new CarbonError(
        BackupCryptError,
        BackupCryptErrorCode.EMPTY_CLEAR_FULL_BACKUP_FILE_XML
      );
    }
    if (!Array.isArray(parsedXml)) {
      throw new CarbonError(
        BackupCryptError,
        BackupCryptErrorCode.CLEAR_FULL_BACKUP_FILE_XML_NOT_AN_ARRAY
      );
    }
    return parsedXml;
  } catch (error) {
    announce(announcements.decipherFullBackupParseFailed(error));
    throw error;
  }
};
const validateFullBackupFileArgs = (
  announce: AnnounceSync,
  fullBackupFile: string,
  fullBackupFileMap: Map<string, number>
) => {
  if (fullBackupFile === undefined || fullBackupFile === null) {
    announce(announcements.decipherFullBackupSkipped());
    return false;
  }
  if (fullBackupFile === "") {
    throw new CarbonError(
      BackupCryptError,
      BackupCryptErrorCode.EMPTY_FULL_BACKUP_FILE
    );
  }
  if (fullBackupFileMap === null) {
    throw new CarbonError(
      BackupCryptError,
      BackupCryptErrorCode.NULL_FULL_BACKUP_FILE_MAP
    );
  }
  if (fullBackupFile && fullBackupFileMap.size === 0) {
    throw new CarbonError(
      BackupCryptError,
      BackupCryptErrorCode.EMPTY_FULL_BACKUP_FILE_MAP
    );
  }
  return true;
};
const decipherFullBackupFile = async (
  cryptoService: CryptoCenterService,
  announce: AnnounceSync,
  fullBackupFile: string
): Promise<string> => {
  try {
    const bytes = await cryptoService.decrypt(fullBackupFile);
    const clearContent = deflatedUtf8ToUtf16(bytes);
    if (!clearContent) {
      const error = new CarbonError(
        BackupCryptError,
        BackupCryptErrorCode.EMPTY_CLEAR_FULL_BACKUP_FILE
      );
      Exception.sendExceptionLog({ error });
      throw error;
    }
    if (
      typeof clearContent === "string" &&
      !clearContent.trim().startsWith("<")
    ) {
      throw new CarbonError(
        BackupCryptError,
        BackupCryptErrorCode.CLEAR_FULL_BACKUP_FILE_NOT_XML
      );
    }
    return clearContent;
  } catch (error) {
    const cryptoPayload = attemptReadCryptoPayload(
      cryptoService,
      fullBackupFile
    );
    announce(
      announcements.decipherFullBackupDecipherFailed(error, cryptoPayload)
    );
    throw error;
  }
};
const makeTransactionFromFullBackupFileItem = (
  announce: AnnounceSync,
  fullBackupFileItem: BaseDataModelObject,
  fullBackupFileMap: Map<string, number>
): ClearTransaction | null => {
  const { Id: itemId, kwType: itemType } = fullBackupFileItem;
  const backupDate = fullBackupFileMap.get(itemId);
  if (backupDate === undefined) {
    announce(
      announcements.decipherFullBackupItemSkipped(
        new Error("Transaction not in full backup list skipped"),
        {
          itemType,
          itemId,
        }
      )
    );
    return null;
  }
  const itemKeys =
    fullBackupFileItem instanceof Object ? Object.keys(fullBackupFileItem) : [];
  if (!itemType) {
    const error: BackupCryptError = new CarbonError(
      BackupCryptError,
      BackupCryptErrorCode.FULL_BACKUP_FILE_ITEM_WITHOUT_KWTYPE
    );
    announce(
      announcements.decipherFullBackupItemReadFailed(
        error.addAdditionalInfo({ itemId, itemKeys }),
        itemId
      )
    );
    throw error;
  }
  if (!itemId) {
    announce(
      announcements.decipherFullBackupItemSkipped(
        new Error("Transaction without id skipped"),
        { itemType }
      )
    );
    return null;
  }
  announce(
    announcements.decipherFullBackupItemRead(itemType, itemId, backupDate)
  );
  return {
    type: getTransactionTypeFromDataModelType(itemType),
    backupDate,
    action: "BACKUP_EDIT",
    identifier: itemId,
    content: fullBackupFileItem,
  };
};
const announceMissingFullBackupContents = (
  announce: AnnounceSync,
  fullBackupFileMap: Map<string, number>,
  fullBackupFileItemIds: Set<string>
) => {
  for (const listedItemId in fullBackupFileMap.keys()) {
    if (fullBackupFileItemIds.has(listedItemId)) {
      continue;
    }
    announce(
      announcements.decipherFullBackupItemSkipped(
        new Error("Missing full backup item content"),
        { itemId: listedItemId }
      )
    );
  }
};
const makeTransactionsFromFullBackupFileItems = (
  announce: AnnounceSync,
  fullBackupFileItemsContent: BaseDataModelObject[],
  fullBackupFileMap: Map<string, number>
): ClearTransaction[] => {
  const fullBackupFileItemCount = fullBackupFileItemsContent.length;
  const clearTransactions: ClearTransaction[] = [];
  const itemIds = new Set<string>();
  for (let itemIdx = 0; itemIdx < fullBackupFileItemCount; ++itemIdx) {
    const item = fullBackupFileItemsContent[itemIdx];
    if (item.Id) {
      itemIds.add(item.Id);
    }
    const clearTransaction = makeTransactionFromFullBackupFileItem(
      announce,
      item,
      fullBackupFileMap
    );
    if (!clearTransaction) {
      continue;
    }
    clearTransactions.push(clearTransaction);
  }
  announceMissingFullBackupContents(announce, fullBackupFileMap, itemIds);
  return clearTransactions;
};
export async function decryptFullBackupFile(
  cryptoService: CryptoCenterService,
  announce: AnnounceSync,
  fullBackupFile: string,
  fullBackupFileMap: Map<string, number>
): Promise<ClearTransaction[]> {
  try {
    if (
      !validateFullBackupFileArgs(announce, fullBackupFile, fullBackupFileMap)
    ) {
      return [];
    }
    announce(announcements.decipherFullBackupStarted());
    const xml = await decipherFullBackupFile(
      cryptoService,
      announce,
      fullBackupFile
    );
    const parsedXml = await parseFullBackupFileXml(announce, xml);
    const fullBackupFileItemsContent = fixKwType(parsedXml) as [];
    const clearTransactions = makeTransactionsFromFullBackupFileItems(
      announce,
      fullBackupFileItemsContent,
      fullBackupFileMap
    );
    announce(
      announcements.decipherFullBackupFinished(clearTransactions.length)
    );
    return clearTransactions;
  } catch (error) {
    announce(announcements.decipherFullBackupFailed(error));
    if (
      isCarbonError(
        error,
        BackupCryptError,
        BackupCryptErrorCode.EMPTY_CLEAR_FULL_BACKUP_FILE
      )
    ) {
      return [];
    }
    throw error;
  }
}
