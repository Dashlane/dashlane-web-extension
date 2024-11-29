import {
  Highlight,
  ItemType,
  UserSelectVaultItemEvent,
} from "@dashlane/hermes";
import { IdVaultItemType } from "../../../../webapp/ids/types";
import { VaultItemType } from "@dashlane/vault-contracts";
import { logEvent } from "../../logEvent";
const logSelectVaultItem = (
  itemId: string,
  itemType: ItemType,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logEvent(
    new UserSelectVaultItemEvent({
      highlight: highlight,
      index: listIndex,
      itemId,
      itemType,
      totalCount: listLength,
    })
  );
};
export const logSelectCredential = (
  itemId: string,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logSelectVaultItem(
    itemId,
    ItemType.Credential,
    listIndex,
    listLength,
    highlight
  );
};
export const logSelectSecret = (
  itemId: string,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logSelectVaultItem(itemId, ItemType.Secret, listIndex, listLength, highlight);
};
export const logSelectPasskey = (
  itemId: string,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logSelectVaultItem(
    itemId,
    ItemType.Passkey,
    listIndex,
    listLength,
    highlight
  );
};
export const logSelectSecureNote = (
  itemId: string,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logSelectVaultItem(
    itemId,
    ItemType.SecureNote,
    listIndex,
    listLength,
    highlight
  );
};
type PersonalInfoItemType =
  | ItemType.Address
  | ItemType.Company
  | ItemType.Email
  | ItemType.Identity
  | ItemType.Phone
  | ItemType.Website;
export const logSelectPersonalInfo = (
  itemId: string,
  itemType: PersonalInfoItemType,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logSelectVaultItem(itemId, itemType, listIndex, listLength, highlight);
};
export const logSelectCreditCard = (
  itemId: string,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logSelectVaultItem(
    itemId,
    ItemType.CreditCard,
    listIndex,
    listLength,
    highlight
  );
};
export const logSelectBankAccount = (
  itemId: string,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logSelectVaultItem(
    itemId,
    ItemType.BankStatement,
    listIndex,
    listLength,
    highlight
  );
};
type IdItemType =
  | ItemType.DriverLicence
  | ItemType.FiscalStatement
  | ItemType.IdCard
  | ItemType.Passport
  | ItemType.SocialSecurity;
export const idToItemType: Record<IdVaultItemType, IdItemType> = {
  [VaultItemType.DriversLicense]: ItemType.DriverLicence,
  [VaultItemType.FiscalId]: ItemType.FiscalStatement,
  [VaultItemType.IdCard]: ItemType.IdCard,
  [VaultItemType.Passport]: ItemType.Passport,
  [VaultItemType.SocialSecurityId]: ItemType.SocialSecurity,
};
export const logSelectId = (
  itemId: string,
  itemType: IdItemType,
  listIndex?: number,
  listLength?: number,
  highlight: Highlight = Highlight.None
) => {
  logSelectVaultItem(itemId, itemType, listIndex, listLength, highlight);
};
