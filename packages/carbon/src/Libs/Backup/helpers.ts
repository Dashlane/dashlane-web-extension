import { SyncSummary } from "Libs/WS/Backup/types";
export function countSyncSummaryTransactions(summary: SyncSummary): number {
  if (!summary) {
    return 0;
  }
  const transactionTypes = Object.keys(summary.transactions);
  return transactionTypes.reduce(
    (sum, transactionType) =>
      sum + (Object.keys(summary.transactions[transactionType]) || []).length,
    0
  );
}
