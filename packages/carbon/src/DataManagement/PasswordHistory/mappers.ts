import { PasswordHistoryMappers } from "DataManagement/PasswordHistory/types";
export const getPasswordHistoryMappers = (): PasswordHistoryMappers => ({
  primaryInfo: (passwordHistoryItem) => passwordHistoryItem.primaryInfo,
  timestamp: (passwordHistoryItem) => passwordHistoryItem.timestamp,
  type: (passwordHistoryItem) => passwordHistoryItem.type,
  id: (passwordHistoryItem) => passwordHistoryItem.id,
  credentialId: (passwordHistoryItem) =>
    ("credentialId" in passwordHistoryItem &&
      passwordHistoryItem.credentialId) ||
    "",
});
