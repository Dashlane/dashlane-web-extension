import {
  DriversLicense,
  FiscalId,
  IdCard,
  Passport,
  SocialSecurityId,
  VaultItemType,
} from "@dashlane/vault-contracts";
import {
  AddDriverLicenseResult,
  AddFiscalIdResult,
  AddIdCardResult,
  AddPassportResult,
  AddSocialSecurityIdResult,
} from "@dashlane/communication";
export type IdVaultItemType = Extract<
  VaultItemType,
  | VaultItemType.DriversLicense
  | VaultItemType.FiscalId
  | VaultItemType.IdCard
  | VaultItemType.Passport
  | VaultItemType.SocialSecurityId
>;
export type IdItem =
  | DriversLicense
  | FiscalId
  | IdCard
  | Passport
  | SocialSecurityId;
export type Id =
  | "driverLicenses"
  | "fiscalIds"
  | "idCards"
  | "passports"
  | "socialSecurityIds";
export const idCardFormFields = [
  "idName",
  "idNumber",
  "issueDate",
  "expirationDate",
  "country",
  "spaceId",
] as const;
export type IdCardFormFields = Pick<IdCard, (typeof idCardFormFields)[number]>;
export const socialSecurityIdFormFields = [
  "idName",
  "idNumber",
  "country",
  "spaceId",
] as const;
export type SocialSecurityIdFormFields = Pick<
  SocialSecurityId,
  (typeof socialSecurityIdFormFields)[number]
>;
export const driverLicenseFormFields = [
  "idName",
  "idNumber",
  "issueDate",
  "expirationDate",
  "country",
  "state",
  "spaceId",
] as const;
export type DriverLicenseFormFields = Pick<
  DriversLicense,
  (typeof driverLicenseFormFields)[number]
>;
export const fiscalIdFormFields = [
  "fiscalNumber",
  "teledeclarantNumber",
  "country",
  "spaceId",
] as const;
export type FiscalIdFormFields = Pick<
  FiscalId,
  (typeof fiscalIdFormFields)[number]
>;
export const passportFormFields = [
  "idName",
  "idNumber",
  "issueDate",
  "issuePlace",
  "expirationDate",
  "country",
  "spaceId",
] as const;
export type PassportFormFields = Pick<
  Passport,
  (typeof passportFormFields)[number]
>;
export type IdFormFields =
  | IdCardFormFields
  | SocialSecurityIdFormFields
  | DriverLicenseFormFields
  | FiscalIdFormFields
  | PassportFormFields;
export type AddIdResults =
  | AddIdCardResult
  | AddSocialSecurityIdResult
  | AddDriverLicenseResult
  | AddFiscalIdResult
  | AddPassportResult;
export enum ThumbnailSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}
