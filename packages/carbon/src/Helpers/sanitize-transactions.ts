import type { EditTransaction } from "Libs/Backup/Transactions/types";
export const sanitizeTransactions = (
  transactionsList: EditTransaction[]
): EditTransaction[] => {
  return transactionsList.filter(Boolean);
};
