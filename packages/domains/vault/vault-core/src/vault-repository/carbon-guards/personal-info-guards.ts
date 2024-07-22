import {
  Address,
  Company,
  Email,
  Identity,
  PersonalWebsite,
  Phone,
} from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { isVaultItemArray } from "./is-vault-item-array";
export const isAddressArray = (uut: unknown): uut is Address[] =>
  isVaultItemArray(uut, VaultItemType.Address);
export const isCompanyArray = (uut: unknown): uut is Company[] =>
  isVaultItemArray(uut, VaultItemType.Company);
export const isEmailArray = (uut: unknown): uut is Email[] =>
  isVaultItemArray(uut, VaultItemType.Email);
export const isIdentityArray = (uut: unknown): uut is Identity[] =>
  isVaultItemArray(uut, VaultItemType.Identity);
export const isPhoneArray = (uut: unknown): uut is Phone[] =>
  isVaultItemArray(uut, VaultItemType.Phone);
export const isWebsiteArray = (uut: unknown): uut is PersonalWebsite[] =>
  isVaultItemArray(uut, VaultItemType.Website);
