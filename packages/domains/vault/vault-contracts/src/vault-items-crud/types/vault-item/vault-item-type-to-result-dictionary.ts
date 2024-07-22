import { VaultItemsQueryResult } from "../../queries/vault-items.query";
import { VaultItemType } from "./vault-item-type-enum";
export const VaultItemTypeToResultDictionary: Record<
  VaultItemType,
  keyof VaultItemsQueryResult
> = {
  [VaultItemType.Address]: "addressesResult",
  [VaultItemType.BankAccount]: "bankAccountsResult",
  [VaultItemType.Company]: "companiesResult",
  [VaultItemType.Credential]: "credentialsResult",
  [VaultItemType.DriversLicense]: "driversLicensesResult",
  [VaultItemType.Email]: "emailsResult",
  [VaultItemType.FiscalId]: "fiscalIdsResult",
  [VaultItemType.IdCard]: "idCardsResult",
  [VaultItemType.Identity]: "identitiesResult",
  [VaultItemType.Passkey]: "passkeysResult",
  [VaultItemType.Passport]: "passportsResult",
  [VaultItemType.PaymentCard]: "paymentCardsResult",
  [VaultItemType.Phone]: "phonesResult",
  [VaultItemType.Secret]: "secretsResult",
  [VaultItemType.SecureNote]: "secureNotesResult",
  [VaultItemType.SocialSecurityId]: "socialSecurityIdsResult",
  [VaultItemType.Website]: "websitesResult",
};
