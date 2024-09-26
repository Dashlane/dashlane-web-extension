import { isEmpty } from "ramda";
import {
  Address,
  BankAccount,
  Collection,
  Company,
  Credential,
  CredentialCategory,
  DataModelObject,
  DataModelType,
  DriverLicense,
  Email,
  IdCard,
  Identity,
  Note,
  NoteCategory,
  Passkey,
  Passport,
  PaymentCard,
  PersonalWebsite,
  Phone,
  Secret,
} from "@dashlane/communication";
import { UniqueIdentifierKeyObject } from "./types";
const sharedDataModelProperties: Record<
  keyof Pick<DataModelObject, "Attachments">,
  boolean
> = {
  Attachments: false,
};
const uniqueCredentialKeys: UniqueIdentifierKeyObject<Credential> = {
  ...sharedDataModelProperties,
  Title: true,
  Email: true,
  Login: true,
  SecondaryLogin: true,
  Password: true,
  Strength: false,
  Note: true,
  Checked: false,
  Status: false,
  SharedObject: false,
  ModificationDatetime: false,
  Category: false,
  Url: true,
  UserSelectedUrl: false,
  UseFixedUrl: false,
  TrustedUrlGroup: false,
  NumberUse: false,
  AutoLogin: false,
  AutoProtected: false,
  SubdomainOnly: false,
  Type: false,
  Server: false,
  Port: false,
  Alias: false,
  SID: false,
  ConnectionOptions: false,
  domainIcon: false,
  limitedPermissions: false,
  OtpSecret: true,
  OtpUrl: true,
  LinkedServices: false,
};
const uniqueSecretKeys: UniqueIdentifierKeyObject<Secret> = {
  ...sharedDataModelProperties,
  Title: true,
  Content: true,
  Secured: false,
};
const uniqueSecureNoteKeys: UniqueIdentifierKeyObject<Note> = {
  ...sharedDataModelProperties,
  Title: true,
  Category: false,
  Type: false,
  limitedPermissions: false,
  Content: true,
  Secured: false,
  CreationDate: false,
  UpdateDate: false,
};
const uniqueIdCardKeys: UniqueIdentifierKeyObject<IdCard> = {
  ...sharedDataModelProperties,
  LinkedIdentity: false,
  Fullname: true,
  Sex: true,
  DateOfBirth: true,
  Number: true,
  ExpireDate: true,
  DeliveryDate: true,
};
const uniqueEmailKeys: UniqueIdentifierKeyObject<Email> = {
  ...sharedDataModelProperties,
  Email: true,
  Type: false,
  EmailName: true,
};
const uniquePhoneKeys: UniqueIdentifierKeyObject<Phone> = {
  ...sharedDataModelProperties,
  Type: false,
  Number: true,
  NumberNational: true,
  NumberInternational: true,
  PhoneName: true,
  PersonalNote: true,
};
const uniqueIdentityKeys: UniqueIdentifierKeyObject<Identity> = {
  ...sharedDataModelProperties,
  Title: true,
  FirstName: true,
  MiddleName: true,
  LastName: true,
  LastName2: true,
  Pseudo: false,
  BirthDate: true,
  BirthPlace: true,
};
const uniquePassKeyKeys: UniqueIdentifierKeyObject<Passkey> = {
  ...sharedDataModelProperties,
  Counter: false,
  CredentialId: true,
  ItemName: true,
  KeyAlgorithm: true,
  Note: true,
  PrivateKey: true,
  RpId: true,
  RpName: true,
  UserDisplayName: true,
  UserHandle: true,
};
const uniquePassportKeys: UniqueIdentifierKeyObject<Passport> = {
  ...sharedDataModelProperties,
  LinkedIdentity: false,
  Fullname: true,
  Sex: true,
  DateOfBirth: true,
  Number: true,
  ExpireDate: true,
  DeliveryDate: true,
  DeliveryPlace: true,
};
const uniqueWebsiteKeys: UniqueIdentifierKeyObject<PersonalWebsite> = {
  ...sharedDataModelProperties,
  PersonalNote: true,
  Name: true,
  Website: true,
};
const uniqueDriversLicenseKeys: UniqueIdentifierKeyObject<DriverLicense> = {
  ...sharedDataModelProperties,
  Number: true,
  LinkedIdentity: false,
  Fullname: true,
  Sex: true,
  DateOfBirth: true,
  DeliveryDate: true,
  ExpireDate: true,
  State: true,
};
const uniqueCompanyKeys: UniqueIdentifierKeyObject<Company> = {
  ...sharedDataModelProperties,
  PersonalNote: true,
  Name: true,
  JobTitle: true,
};
const uniqueAddressKeys: UniqueIdentifierKeyObject<Address> = {
  ...sharedDataModelProperties,
  PersonalNote: true,
  State: true,
  AddressName: true,
  Receiver: true,
  AddressFull: true,
  City: true,
  ZipCode: true,
  Country: true,
  StreetNumber: true,
  StreetTitle: true,
  StreetName: true,
  StateNumber: true,
  StateLevel2: true,
  Building: true,
  Stairs: true,
  Floor: true,
  Door: true,
  DigitCode: true,
  LinkedPhone: false,
};
const uniquePaymentCardKeys: UniqueIdentifierKeyObject<PaymentCard> = {
  ...sharedDataModelProperties,
  Name: true,
  CardNumber: true,
  CardNumberLastDigits: true,
  OwnerName: true,
  SecurityCode: true,
  ExpireMonth: true,
  ExpireYear: true,
  StartMonth: true,
  StartYear: true,
  IssueNumber: true,
  Color: false,
  Bank: true,
  CCNote: true,
  Type: false,
};
const uniqueBankAccountKeys: UniqueIdentifierKeyObject<BankAccount> = {
  ...sharedDataModelProperties,
  BankAccountName: true,
  BankAccountOwner: true,
  BankAccountIBAN: true,
  BankAccountBIC: true,
  BankAccountBank: true,
};
const uniqueCollectionKeys: UniqueIdentifierKeyObject<Collection> = {
  Attachments: false,
  Name: true,
  VaultItems: true,
};
const uniqueAuthCategoryKeys: UniqueIdentifierKeyObject<CredentialCategory> = {
  Attachments: false,
  CategoryName: true,
};
const uniqueSecureNoteCategoryKeys: UniqueIdentifierKeyObject<NoteCategory> = {
  Attachments: false,
  CategoryName: true,
};
const getUniqueKeysFromObject = (object: Record<string, boolean>) => {
  return Object.keys(object).filter((key) => !!object[key]);
};
const KW_TYPE_TO_UNIQUE_KEYS: Record<DataModelType, string[]> = {
  KWAddress: getUniqueKeysFromObject(uniqueAddressKeys),
  KWAuthCategory: getUniqueKeysFromObject(uniqueAuthCategoryKeys),
  KWAuthentifiant: getUniqueKeysFromObject(uniqueCredentialKeys),
  KWBankStatement: getUniqueKeysFromObject(uniqueBankAccountKeys),
  KWCollection: getUniqueKeysFromObject(uniqueCollectionKeys),
  KWCompany: getUniqueKeysFromObject(uniqueCompanyKeys),
  KWDataChangeHistory: [],
  KWDriverLicence: getUniqueKeysFromObject(uniqueDriversLicenseKeys),
  KWEmail: getUniqueKeysFromObject(uniqueEmailKeys),
  KWFiscalStatement: [],
  KWGeneratedPassword: [],
  KWIDCard: getUniqueKeysFromObject(uniqueIdCardKeys),
  KWIdentity: getUniqueKeysFromObject(uniqueIdentityKeys),
  KWMerchand: [],
  KWMiscData: [],
  KWPasskey: getUniqueKeysFromObject(uniquePassKeyKeys),
  KWPassport: getUniqueKeysFromObject(uniquePassportKeys),
  KWPaymentMean_creditCard: getUniqueKeysFromObject(uniquePaymentCardKeys),
  KWPaymentMean_paypal: [],
  KWPersonalWebsite: getUniqueKeysFromObject(uniqueWebsiteKeys),
  KWPhone: getUniqueKeysFromObject(uniquePhoneKeys),
  KWPurchaseAccount: [],
  KWPurchaseCategory: [],
  KWPurchasePaidBasket: [],
  KWPurchaseTrueArticle: [],
  KWSecureFileInfo: [],
  KWSecret: getUniqueKeysFromObject(uniqueSecretKeys),
  KWSecureNote: getUniqueKeysFromObject(uniqueSecureNoteKeys),
  KWSecureNoteCategory: getUniqueKeysFromObject(uniqueSecureNoteCategoryKeys),
  KWSecurityBreach: [],
  KWSettingsManagerApp: [],
  KWSocialSecurityStatement: [],
  KWWebSite: [],
};
const mapUniqueKeysToIdentifier = (
  uniqueKeys: string[],
  vaultItem: DataModelObject
) => {
  const uniqueIdentifierObject: Record<string, string> = {};
  uniqueKeys.forEach((uniqueKey) => {
    uniqueIdentifierObject[uniqueKey] = vaultItem[uniqueKey] ?? "";
  });
  return isEmpty(uniqueIdentifierObject)
    ? ""
    : JSON.stringify(uniqueIdentifierObject);
};
export const getUniqueVaultItemIdentifier = (vaultItem: DataModelObject) => {
  return mapUniqueKeysToIdentifier(
    KW_TYPE_TO_UNIQUE_KEYS[vaultItem.kwType],
    vaultItem
  );
};
