import { curry, find, pick, propEq } from "ramda";
import {
  BaseDataModelObject,
  DataModelType,
  ExceptionCriticality,
} from "@dashlane/communication";
import {
  BaseTransaction,
  DATAMODEL_TYPE_TO_TRANSACTION_TYPE,
  Transaction,
  TransactionAction,
  TransactionType,
} from "Libs/Backup/Transactions/types";
import Debugger from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { ChangeHistory } from "DataManagement/ChangeHistory";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { ContentToUpload } from "Libs/Backup/Upload/";
import { utf16ToDeflatedUtf8 } from "Libs/CryptoCenter";
import { CryptoCenterService } from "Libs/CryptoCenter/types";
import { getDashlaneXml } from "Libs/XML";
import { announcements, AnnounceSync } from "Libs/Backup/Probe";
export const supportedDataTypesForUpload: DataModelType[] = [
  "KWAddress",
  "KWAuthentifiant",
  "KWBankStatement",
  "KWCollection",
  "KWCompany",
  "KWDataChangeHistory",
  "KWDriverLicence",
  "KWEmail",
  "KWFiscalStatement",
  "KWGeneratedPassword",
  "KWIdentity",
  "KWIDCard",
  "KWPasskey",
  "KWPassport",
  "KWPaymentMean_creditCard",
  "KWPersonalWebsite",
  "KWPhone",
  "KWSecret",
  "KWSecureFileInfo",
  "KWSecureNote",
  "KWSecurityBreach",
  "KWSettingsManagerApp",
  "KWSocialSecurityStatement",
];
export const supportedForUploadKwTypeToTransactionTypeMap = pick<
  {
    [k in DataModelType]: TransactionType;
  },
  DataModelType
>(supportedDataTypesForUpload, DATAMODEL_TYPE_TO_TRANSACTION_TYPE);
export function getTransactionXml(
  data: BaseDataModelObject | ChangeHistory
): string {
  if (!supportedForUploadKwTypeToTransactionTypeMap[data.kwType]) {
    Debugger.error(
      `Unsupported kwType "${data.kwType}" for transformation to XML`
    );
    return "";
  }
  return getDashlaneXml(data);
}
export async function createNewTransaction(
  cryptoCenterService: CryptoCenterService,
  announce: AnnounceSync,
  itemToUpload: ContentToUpload
): Promise<Transaction | null> {
  try {
    const { itemId, kwType, content } = itemToUpload;
    const transactionType: TransactionType =
      supportedForUploadKwTypeToTransactionTypeMap[kwType];
    if (itemToUpload.action === "REMOVE") {
      const transaction: Transaction = {
        type: transactionType,
        action: "BACKUP_REMOVE" as TransactionAction,
        identifier: itemId,
        objectType: "transaction",
        time: getUnixTimestamp(),
        backupDate: 0,
        content: "",
      };
      return Promise.resolve(transaction);
    }
    const bytes = utf16ToDeflatedUtf8(getTransactionXml(content));
    const cipheredText = await cryptoCenterService.encrypt(bytes);
    const backupDate = 0;
    const transaction: Transaction = {
      type: transactionType,
      action: "BACKUP_EDIT",
      identifier: itemId,
      objectType: "transaction",
      time: getUnixTimestamp(),
      backupDate,
      content: cipheredText,
    };
    announce(
      announcements.transactionCiphered(transactionType, itemId, backupDate)
    );
    return transaction;
  } catch (exception) {
    const error = new Error(
      `[Sync] - upload: failed to create transaction. ${exception}`
    );
    sendExceptionLog({ error, code: ExceptionCriticality.ERROR });
    return null;
  }
}
const hasMatchingId = propEq("identifier");
export type IsEditionTransaction = (obj: BaseTransaction) => boolean;
export const isEditionTransaction: IsEditionTransaction = propEq(
  "action",
  "BACKUP_EDIT"
);
export type IsRemoveTransaction = (obj: BaseTransaction) => boolean;
export const isRemovalTransaction: IsRemoveTransaction = propEq(
  "action",
  "BACKUP_REMOVE"
);
export type FindTransaction = {
  (v1: string): (v2: BaseTransaction[]) => BaseTransaction;
  (v1: string, v2: BaseTransaction[]): BaseTransaction;
};
export const findTransaction: FindTransaction = curry(
  (id: string, change: BaseTransaction[]) =>
    find<BaseTransaction>(hasMatchingId(id), change)
);
