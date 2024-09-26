import {
  BaseTransaction,
  TransactionAction,
} from "Libs/Backup/Transactions/types";
const countTransactions = (
  transactions: BaseTransaction[],
  action: TransactionAction
) =>
  transactions.reduce((acc, current) => {
    return current.identifier && current.action === action ? acc + 1 : acc;
  }, 0);
export const countEditionTransactions = (transactions: BaseTransaction[]) =>
  countTransactions(transactions, "BACKUP_EDIT");
export const countRemoveTransactions = (transactions: BaseTransaction[]) =>
  countTransactions(transactions, "BACKUP_REMOVE");
