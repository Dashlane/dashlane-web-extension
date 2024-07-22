import {
  Address,
  BankAccount,
  Company,
  Credential,
  DriversLicense,
  Email,
  FiscalId,
  IdCard,
  Identity,
  Passkey,
  Passport,
  PaymentCard,
  Phone,
  Secret,
  SecureNote,
  SocialSecurityId,
  VaultItemType,
  Website,
} from "../types";
type AddressParam = {
  vaultItemType: VaultItemType.Address;
  content: Partial<Address>;
};
type CredentialParam = {
  vaultItemType: VaultItemType.Credential;
  content: Partial<Credential>;
};
type BankAccountParam = {
  vaultItemType: VaultItemType.BankAccount;
  content: Partial<BankAccount>;
};
type CompanyParam = {
  vaultItemType: VaultItemType.Company;
  content: Partial<Company>;
};
type DriversLicenseParam = {
  vaultItemType: VaultItemType.DriversLicense;
  content: Partial<DriversLicense>;
};
type EmailParam = {
  vaultItemType: VaultItemType.Email;
  content: Partial<Email>;
};
type FiscalIdParam = {
  vaultItemType: VaultItemType.FiscalId;
  content: Partial<FiscalId>;
};
type IdCardParam = {
  vaultItemType: VaultItemType.IdCard;
  content: Partial<IdCard>;
};
type IdentityParam = {
  vaultItemType: VaultItemType.Identity;
  content: Partial<Identity>;
};
type PasskeyParam = {
  vaultItemType: VaultItemType.Passkey;
  content: Passkey;
};
type PassportParam = {
  vaultItemType: VaultItemType.Passport;
  content: Partial<Passport>;
};
type PaymentCardParam = {
  vaultItemType: VaultItemType.PaymentCard;
  content: Partial<PaymentCard>;
};
type PhoneParam = {
  vaultItemType: VaultItemType.Phone;
  content: Partial<Phone>;
};
type SecureNoteParam = {
  vaultItemType: VaultItemType.SecureNote;
  content: Partial<SecureNote>;
};
type SecretParam = {
  vaultItemType: VaultItemType.Secret;
  content: Partial<Secret>;
};
type SocialSecurityIdParam = {
  vaultItemType: VaultItemType.SocialSecurityId;
  content: Partial<SocialSecurityId>;
};
type WebsiteParam = {
  vaultItemType: VaultItemType.Website;
  content: Partial<Website>;
};
export type VaultItemParam =
  | AddressParam
  | BankAccountParam
  | CompanyParam
  | CredentialParam
  | DriversLicenseParam
  | EmailParam
  | FiscalIdParam
  | IdCardParam
  | IdentityParam
  | PasskeyParam
  | PassportParam
  | PaymentCardParam
  | PhoneParam
  | SecureNoteParam
  | SecretParam
  | SocialSecurityIdParam
  | WebsiteParam;
