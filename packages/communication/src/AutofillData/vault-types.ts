import {
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { CredentialWithCategory } from "../data-management";
import { DataModelType } from "../DataModel";
export type VaultAutofillView =
  VaultAutofillViewInterfaces[keyof VaultAutofillViewInterfaces];
export const vaultSourceTypeToDataModelTypeMap: Record<
  VaultSourceType,
  DataModelType
> = {
  [VaultSourceType.Address]: DataModelType.KWAddress,
  [VaultSourceType.BankAccount]: DataModelType.KWBankStatement,
  [VaultSourceType.Company]: DataModelType.KWCompany,
  [VaultSourceType.Credential]: DataModelType.KWAuthentifiant,
  [VaultSourceType.DriverLicense]: DataModelType.KWDriverLicence,
  [VaultSourceType.Email]: DataModelType.KWEmail,
  [VaultSourceType.FiscalId]: DataModelType.KWFiscalStatement,
  [VaultSourceType.GeneratedPassword]: DataModelType.KWGeneratedPassword,
  [VaultSourceType.IdCard]: DataModelType.KWIDCard,
  [VaultSourceType.Identity]: DataModelType.KWIdentity,
  [VaultSourceType.NoteCategory]: DataModelType.KWSecureNoteCategory,
  [VaultSourceType.Note]: DataModelType.KWSecureNote,
  [VaultSourceType.Passkey]: DataModelType.KWPasskey,
  [VaultSourceType.Passport]: DataModelType.KWPassport,
  [VaultSourceType.PaymentCard]: DataModelType.KWPaymentMean_creditCard,
  [VaultSourceType.PersonalWebsite]: DataModelType.KWPersonalWebsite,
  [VaultSourceType.Phone]: DataModelType.KWPhone,
  [VaultSourceType.SocialSecurityId]: DataModelType.KWSocialSecurityStatement,
  [VaultSourceType.Secret]: DataModelType.KWSecret,
};
export type CredentialWithCategoryAndDomain = {
  credential: CredentialWithCategory;
  domain: string;
};
