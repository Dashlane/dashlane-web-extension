import {
  Mappers,
  PasswordHistoryFilterField,
  PasswordHistoryItemBase,
  PasswordHistoryItemType,
  PasswordHistorySortField,
} from "@dashlane/communication";
export interface GeneratedPasswordHistoryItem extends PasswordHistoryItemBase {
  type: PasswordHistoryItemType.Generated;
}
export interface CredentialPasswordHistoryItem extends PasswordHistoryItemBase {
  type: PasswordHistoryItemType.Credential;
  secondaryInfo: string;
  credentialId: string;
  isProtected: boolean;
  spaceId?: string;
  email: string;
  login: string;
  secondaryLogin: string;
}
export type PasswordHistoryItem =
  | GeneratedPasswordHistoryItem
  | CredentialPasswordHistoryItem;
export type PasswordHistoryMappers = Mappers<
  PasswordHistoryItem,
  PasswordHistorySortField,
  PasswordHistoryFilterField
>;
