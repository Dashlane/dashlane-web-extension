import {
  DriverLicense,
  FiscalId,
  IdCard,
  Passport,
  SocialSecurityId,
} from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { isVaultItemArray } from "./is-vault-item-array";
export const isDriversLicenseArray = (uut: unknown): uut is DriverLicense[] =>
  isVaultItemArray(uut, VaultItemType.DriversLicense);
export const isFiscalIdArray = (uut: unknown): uut is FiscalId[] =>
  isVaultItemArray(uut, VaultItemType.FiscalId);
export const isIdCardArray = (uut: unknown): uut is IdCard[] =>
  isVaultItemArray(uut, VaultItemType.IdCard);
export const isPassportArray = (uut: unknown): uut is Passport[] =>
  isVaultItemArray(uut, VaultItemType.Passport);
export const isSocialSecurityIdArray = (
  uut: unknown
): uut is SocialSecurityId[] =>
  isVaultItemArray(uut, VaultItemType.SocialSecurityId);
