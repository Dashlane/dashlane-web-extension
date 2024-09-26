import {
  CredentialPasswordHistoryItemView,
  PasswordHistoryItemType,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import {
  CredentialPasswordHistoryItem,
  PasswordHistoryItem,
} from "DataManagement/PasswordHistory/types";
export const credentialPasswordHistoryItemViewTypeGuard = (
  item: PasswordHistoryItemView
): item is CredentialPasswordHistoryItemView => {
  return item.type === PasswordHistoryItemType.Credential;
};
export const credentialPasswordHistoryItemTypeGuard = (
  item: PasswordHistoryItem
): item is CredentialPasswordHistoryItem => {
  return item.type === PasswordHistoryItemType.Credential;
};
