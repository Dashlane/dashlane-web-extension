import { UploadDataForMasterPasswordChangePayload } from "@dashlane/server-sdk/v1";
import type { EditTransaction } from "Libs/Backup/Transactions/types";
export const formatTransaction = (
  transactions: EditTransaction[]
): UploadDataForMasterPasswordChangePayload["transactions"] => {
  return transactions.map(({ action, content, identifier, time, type }) => ({
    action,
    content,
    identifier,
    time,
    type,
  }));
};
