import { PickByValue } from "utility-types";
import type {
  Address,
  BankAccount,
  BaseDataModelObject,
  BreachesUpdaterStatus,
  Collection,
  Company,
  Credential,
  CredentialCategory,
  DriverLicense,
  Email,
  FiscalId,
  GeneratedPassword,
  IdCard,
  Identity,
  VersionedBreaches as LegacyVersionedBreaches,
  Note,
  NoteCategory,
  Passkey,
  Passport,
  PaymentCard,
  PaypalAccount,
  PersonalWebsite,
  Phone,
  Secret,
  SecureFileInfo,
  SocialSecurityId,
} from "@dashlane/communication";
import { ChangeHistory } from "DataManagement/ChangeHistory/types";
import { UploadChange } from "Libs/Backup/Upload/UploadChange/types";
import {
  VersionedBreach,
  VersionedBreachesMetadata,
} from "DataManagement/Breaches/types";
export interface PersonalData {
  addresses: Address[];
  bankAccounts: BankAccount[];
  collections: Collection[];
  companies: Company[];
  credentials: Credential[];
  credentialCategories: CredentialCategory[];
  driverLicenses: DriverLicense[];
  emails: Email[];
  fiscalIds: FiscalId[];
  generatedPasswords: GeneratedPassword[];
  idCards: IdCard[];
  identities: Identity[];
  noteCategories: NoteCategory[];
  notes: Note[];
  passkeys: Passkey[];
  passports: Passport[];
  paymentCards: PaymentCard[];
  paypalAccounts: PaypalAccount[];
  personalWebsites: PersonalWebsite[];
  phones: Phone[];
  secrets: Secret[];
  secureFileInfo: SecureFileInfo[];
  socialSecurityIds: SocialSecurityId[];
  changeHistories: ChangeHistory[];
  changesToUpload: UploadChange[];
  securityBreaches: VersionedBreach[];
  securityBreachesMetadata: VersionedBreachesMetadata;
  breachesUpdaterStatus: BreachesUpdaterStatus;
}
export interface LegacyPersonalData {
  breaches: LegacyVersionedBreaches;
  versionedBreaches: LegacyVersionedBreaches;
}
export type PersonalDataCollections = PickByValue<
  PersonalData,
  BaseDataModelObject[]
>;
