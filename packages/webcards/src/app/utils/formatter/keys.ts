import {
  EmailType,
  PhoneType,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
export const vaultSourceTypeKeyMap: Partial<Record<VaultSourceType, string>> = {
  [VaultSourceType.Address]: "ADDRESS",
  [VaultSourceType.BankAccount]: "BANK_STATEMENT",
  [VaultSourceType.Company]: "COMPANY",
  [VaultSourceType.Credential]: "AUTHENTICATION",
  [VaultSourceType.DriverLicense]: "DRIVER_LICENCE",
  [VaultSourceType.Email]: "EMAIL",
  [VaultSourceType.FiscalId]: "FISCAL",
  [VaultSourceType.GeneratedPassword]: "GENERATED_PASSWORD",
  [VaultSourceType.IdCard]: "ID_CARD",
  [VaultSourceType.Identity]: "IDENTITY",
  [VaultSourceType.Passkey]: "AUTHENTICATION",
  [VaultSourceType.Passport]: "PASSPORT",
  [VaultSourceType.PaymentCard]: "PAYMENT_MEAN_CREDITCARD",
  [VaultSourceType.PersonalWebsite]: "WEBSITE",
  [VaultSourceType.Phone]: "PHONE",
  [VaultSourceType.SocialSecurityId]: "SOCIAL_SECURITY",
};
export const COMMUNICATION_TYPES_TO_TRANSLATIONS_MAP: Record<
  EmailType | PhoneType,
  string | undefined
> = {
  ANY: "phoneAny",
  FAX: "phoneFax",
  LANDLINE: "phoneLandline",
  MOBILE: "phoneMobile",
  WORKFAX: "phoneWorkFax",
  WORKLANDLINE: "phoneWorkLandline",
  WORKMOBILE: "phoneWorkMobile",
  PERSO: "emailPersonal",
  PRO: "emailBusiness",
  NO_TYPE: undefined,
};
