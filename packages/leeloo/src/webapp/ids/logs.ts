import { VaultItemType } from "@dashlane/vault-contracts";
import { Field, ItemType } from "@dashlane/hermes";
import { IdVaultItemType } from "./types";
export const idTypeToItemType: Record<IdVaultItemType, ItemType> = {
  [VaultItemType.DriversLicense]: ItemType.IdCard,
  [VaultItemType.FiscalId]: ItemType.DriverLicence,
  [VaultItemType.IdCard]: ItemType.FiscalStatement,
  [VaultItemType.Passport]: ItemType.Passport,
  [VaultItemType.SocialSecurityId]: ItemType.SocialSecurity,
};
export const idTypeToField: Record<IdVaultItemType, Field> = {
  [VaultItemType.DriversLicense]: Field.Number,
  [VaultItemType.FiscalId]: Field.Number,
  [VaultItemType.IdCard]: Field.FiscalNumber,
  [VaultItemType.Passport]: Field.Number,
  [VaultItemType.SocialSecurityId]: Field.SocialSecurityNumber,
};
