import { PasswordHistoryItemType } from "@dashlane/communication";
import { stringProp } from "DataManagement/Search/utils";
import {
  CredentialPasswordHistoryItem,
  PasswordHistoryItem,
} from "DataManagement/PasswordHistory/types";
import { match } from "DataManagement/Search/match";
import { GeneratedPasswordHistoryItem } from "DataManagement/PasswordHistory/types";
import { getDashlaneDefinedLinkedWebsites } from "DataManagement/LinkedWebsites";
export const searchGettersForCredential: ((
  p: CredentialPasswordHistoryItem
) => string)[] = [
  stringProp<CredentialPasswordHistoryItem>("primaryInfo"),
  stringProp<CredentialPasswordHistoryItem>("domain"),
  stringProp<CredentialPasswordHistoryItem>("email"),
  stringProp<CredentialPasswordHistoryItem>("login"),
  stringProp<CredentialPasswordHistoryItem>("secondaryLogin"),
  (p: CredentialPasswordHistoryItem) =>
    getDashlaneDefinedLinkedWebsites(p.domain).join(" "),
];
export const searchGettersForGeneratedPassword: ((
  p: GeneratedPasswordHistoryItem
) => string)[] = [stringProp<GeneratedPasswordHistoryItem>("primaryInfo")];
export const passwordHistoryItemMatch = (
  query: string,
  passwordHistoryItem: PasswordHistoryItem
) => {
  if (passwordHistoryItem.type === PasswordHistoryItemType.Credential) {
    return match(searchGettersForCredential)(query, passwordHistoryItem);
  }
  return match(searchGettersForGeneratedPassword)(query, passwordHistoryItem);
};
