import {
  BaseDataModelObject,
  DATAMODEL_TYPE_TO_TRANSACTION_TYPE,
  getDataModelTypeFromTransactionType,
  getTransactionTypeFromDataModelType,
  TransactionType,
} from "@dashlane/communication";
export {
  DATAMODEL_TYPE_TO_TRANSACTION_TYPE,
  getDataModelTypeFromTransactionType,
  getTransactionTypeFromDataModelType,
  TransactionType,
};
export type TransactionAction = "BACKUP_EDIT" | "BACKUP_REMOVE";
export interface BaseTransaction {
  action: TransactionAction;
  backupDate: number;
  identifier: string;
  time?: number;
  objectType?: "transaction";
  type: string;
}
export interface Transaction extends BaseTransaction {
  content?: string;
}
export interface EditTransaction extends Transaction {
  action: "BACKUP_EDIT";
}
export interface ClearTransaction extends BaseTransaction {
  content?: BaseDataModelObject;
}
