import { Field, ItemType } from "@dashlane/hermes";
import {
  Address,
  BankAccount,
  Company,
  Credential,
  DataModelObject,
  DataModelType,
  DriverLicense,
  Email,
  FiscalId,
  IdCard,
  Identity,
  Note,
  Passport,
  PaymentCard,
  PersonalWebsite,
  Phone,
  SocialSecurityId,
} from "@dashlane/communication";
export const dataModelTypeToItemType: Partial<Record<DataModelType, ItemType>> =
  {
    [DataModelType.KWAuthentifiant]: ItemType.Credential,
    [DataModelType.KWSecureNote]: ItemType.SecureNote,
    [DataModelType.KWIdentity]: ItemType.Identity,
    [DataModelType.KWEmail]: ItemType.Email,
    [DataModelType.KWPhone]: ItemType.Phone,
    [DataModelType.KWAddress]: ItemType.Address,
    [DataModelType.KWCompany]: ItemType.Company,
    [DataModelType.KWPersonalWebsite]: ItemType.Website,
    [DataModelType.KWPaymentMean_creditCard]: ItemType.CreditCard,
    [DataModelType.KWBankStatement]: ItemType.BankStatement,
    [DataModelType.KWIDCard]: ItemType.IdCard,
    [DataModelType.KWSocialSecurityStatement]: ItemType.SocialSecurity,
    [DataModelType.KWDriverLicence]: ItemType.DriverLicence,
    [DataModelType.KWPassport]: ItemType.Passport,
    [DataModelType.KWFiscalStatement]: ItemType.FiscalStatement,
    [DataModelType.KWSecret]: ItemType.Secret,
  };
export type VaultItemProperty = keyof Credential | keyof Note;
const getCredentialFieldFromProperty = (
  credential: Credential,
  property: keyof Credential
) => {
  switch (property as keyof Credential) {
    case "Email":
      return Field.Email;
    case "Login":
      return Field.Login;
    case "SecondaryLogin":
      return Field.SecondaryLogin;
    case "Password":
      return Field.Password;
    case "AutoLogin":
      return credential.AutoLogin ? Field.AutoLoginOn : Field.AutoLoginOff;
    case "AutoProtected":
      return credential.AutoProtected
        ? Field.MpProtectedOn
        : Field.MpProtectedOff;
    case "Url":
      return Field.Website;
    case "Category":
      return Field.Category;
    case "Note":
      return Field.Note;
    case "SubdomainOnly":
      return credential.SubdomainOnly
        ? Field.SubdomainOnlyOn
        : Field.SubdomainOnlyOff;
    case "Title":
      return Field.Title;
    case "SpaceId":
      return Field.Space;
  }
  return undefined;
};
const getSecureNoteFieldFromProperty = (
  secureNote: Note,
  property: keyof Note
) => {
  switch (property as keyof Note) {
    case "Title":
      return Field.Title;
    case "Content":
      return Field.Content;
    case "Category":
      return Field.Category;
    case "SpaceId":
      return Field.Space;
    case "Secured": {
      return secureNote.Secured ? Field.MpProtectedOn : Field.MpProtectedOff;
    }
  }
  return undefined;
};
const identityPropertyToField: Partial<Record<keyof Identity, Field>> = {
  Title: Field.Title,
  FirstName: Field.FirstName,
  MiddleName: Field.MiddleName,
  LastName: Field.LastName,
  BirthDate: Field.BirthDate,
  BirthPlace: Field.BirthPlace,
  Pseudo: Field.Pseudo,
  SpaceId: Field.Space,
};
const emailPropertyToField: Partial<Record<keyof Email, Field>> = {
  Email: Field.Email,
  Type: Field.Type,
  EmailName: Field.EmailName,
  SpaceId: Field.Space,
};
const phonePropertyToField: Partial<Record<keyof Phone, Field>> = {
  Number: Field.Number,
  PhoneName: Field.PhoneName,
  Type: Field.Type,
  SpaceId: Field.Space,
};
const addressPropertyToField: Partial<Record<keyof Address, Field>> = {
  StreetNumber: Field.StreetNumber,
  StreetName: Field.StreetName,
  StreetTitle: Field.StreetTitle,
  City: Field.City,
  State: Field.State,
  StateLevel2: Field.StateLevel2,
  StateNumber: Field.StateNumber,
  ZipCode: Field.ZipCode,
  Country: Field.Country,
  AddressName: Field.AddressName,
  Receiver: Field.Receiver,
  Building: Field.Building,
  Floor: Field.Floor,
  Door: Field.Door,
  LinkedPhone: Field.LinkedPhone,
  PersonalNote: Field.Note,
  SpaceId: Field.Space,
};
const companyPropertyToField: Partial<Record<keyof Company, Field>> = {
  Name: Field.Name,
  JobTitle: Field.JobTitle,
  SpaceId: Field.Space,
};
const websitePropertyToField: Partial<Record<keyof PersonalWebsite, Field>> = {
  Website: Field.Website,
  Name: Field.Name,
  SpaceId: Field.Space,
};
const paymentCardPropertyToField: Partial<Record<keyof PaymentCard, Field>> = {
  Name: Field.Name,
  OwnerName: Field.OwnerName,
  CardNumber: Field.CardNumber,
  SecurityCode: Field.SecurityCode,
  ExpireMonth: Field.ExpireDate,
  ExpireYear: Field.ExpireDate,
  Color: Field.Color,
  SpaceId: Field.Space,
};
const bankAccountPropertyToField: Partial<Record<keyof BankAccount, Field>> = {
  BankAccountName: Field.Name,
  BankAccountOwner: Field.Owner,
  BankAccountBIC: Field.Bic,
  BankAccountIBAN: Field.Iban,
  BankAccountBank: Field.Bank,
  SpaceId: Field.Space,
};
const idCardPropertyToField: Partial<Record<keyof IdCard, Field>> = {
  Fullname: Field.Fullname,
  Number: Field.Number,
  DeliveryDate: Field.DeliveryDate,
  ExpireDate: Field.ExpireDate,
  LinkedIdentity: Field.LinkedIdentity,
  Sex: Field.Sex,
  DateOfBirth: Field.DateOfBirth,
  SpaceId: Field.Space,
};
const socialSecurityPropertyToField: Partial<
  Record<keyof SocialSecurityId, Field>
> = {
  SocialSecurityFullname: Field.SocialSecurityFullname,
  SocialSecurityNumber: Field.SocialSecurityNumber,
  LinkedIdentity: Field.LinkedIdentity,
  Sex: Field.Sex,
  DateOfBirth: Field.DateOfBirth,
  SpaceId: Field.Space,
};
const driversLicensePropertyToField: Partial<
  Record<keyof DriverLicense, Field>
> = {
  Fullname: Field.Fullname,
  Number: Field.Number,
  DeliveryDate: Field.DeliveryDate,
  ExpireDate: Field.ExpireDate,
  State: Field.State,
  LinkedIdentity: Field.LinkedIdentity,
  Sex: Field.Sex,
  DateOfBirth: Field.DateOfBirth,
  SpaceId: Field.Space,
};
const passportPropertyToField: Partial<Record<keyof Passport, Field>> = {
  Fullname: Field.Fullname,
  Number: Field.Number,
  DeliveryDate: Field.DeliveryDate,
  DeliveryPlace: Field.DeliveryPlace,
  ExpireDate: Field.ExpireDate,
  LinkedIdentity: Field.LinkedIdentity,
  Sex: Field.Sex,
  DateOfBirth: Field.DateOfBirth,
  SpaceId: Field.Space,
};
const fiscalStatementPropertyToField: Partial<Record<keyof FiscalId, Field>> = {
  FiscalNumber: Field.FiscalNumber,
  TeledeclarantNumber: Field.TeledeclarantNumber,
  SpaceId: Field.Space,
};
export const getHermesFieldFromProperty = (
  item: DataModelObject,
  property: VaultItemProperty
): Field => {
  switch (item.kwType) {
    case DataModelType.KWAuthentifiant:
      return getCredentialFieldFromProperty(
        item as Credential,
        property as keyof Credential
      );
    case DataModelType.KWSecureNote:
      return getSecureNoteFieldFromProperty(
        item as Note,
        property as keyof Note
      );
    case DataModelType.KWIdentity:
      return identityPropertyToField[property];
    case DataModelType.KWEmail:
      return emailPropertyToField[property];
    case DataModelType.KWPhone:
      return phonePropertyToField[property];
    case DataModelType.KWAddress:
      return addressPropertyToField[property];
    case DataModelType.KWCompany:
      return companyPropertyToField[property];
    case DataModelType.KWPersonalWebsite:
      return websitePropertyToField[property];
    case DataModelType.KWPaymentMean_creditCard:
      return paymentCardPropertyToField[property];
    case DataModelType.KWBankStatement:
      return bankAccountPropertyToField[property];
    case DataModelType.KWIDCard:
      return idCardPropertyToField[property];
    case DataModelType.KWSocialSecurityStatement:
      return socialSecurityPropertyToField[property];
    case DataModelType.KWDriverLicence:
      return driversLicensePropertyToField[property];
    case DataModelType.KWPassport:
      return passportPropertyToField[property];
    case DataModelType.KWFiscalStatement:
      return fiscalStatementPropertyToField[property];
  }
  return undefined;
};
export const getUpdatedProperties = (
  item: DataModelObject,
  originalItem: DataModelObject
) =>
  Object.getOwnPropertyNames(item).filter((prop) => {
    const propertyExists = item[prop] !== undefined;
    const propertyChanged = item[prop] !== originalItem[prop];
    return propertyExists && propertyChanged;
  }) as VaultItemProperty[];
