import {
  AddressAutofillView,
  BankAccountAutofillView,
  CompanyAutofillView,
  CredentialAutofillView,
  DataModelAutofillView,
  DriverLicenseAutofillView,
  EmailAutofillView,
  FiscalIdAutofillView,
  GeneratedPasswordAutofillView,
  IdCardAutofillView,
  IdentityAutofillView,
  NoteAutofillView,
  PasskeyAutofillView,
  PassportAutofillView,
  PaymentCardAutofillView,
  PersonalWebsiteAutofillView,
  PhoneAutofillView,
  SharingStatusItem,
  SocialSecurityIdAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import {
  Address,
  BankAccount,
  PhoneType as CarbonPhoneType,
  Company,
  Credential,
  DataModelObject,
  DriverLicenseWithIdentity,
  Email,
  FiscalId,
  GeneratedPassword,
  IdCardWithIdentity,
  Identity,
  Note,
  Passkey,
  PassportWithIdentity,
  PaymentCard,
  PersonalWebsite,
  Phone,
  SocialSecurityIdWithIdentity,
} from "@dashlane/communication";
import { defaultTo } from "ramda";
import { getBankInfoFromBankAccountData } from "DataManagement/BankAccounts/helpers";
import {
  defaultColor,
  getLastDigitsFromCardNumber,
} from "DataManagement/PaymentCards/helpers";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
import {
  epochToDate,
  identityToName,
  vaultCountryToViewCountry,
  vaultDateToViewDate,
  ZERO_INDEX_BASED_MONTH_OFFSET,
} from "DataManagement/Ids/helpers";
import { getUserAddedLinkedWebsiteDomains } from "DataManagement/LinkedWebsites";
import {
  findStateCode,
  findStateLevel2Name,
  findStateName,
} from "StaticData/GeographicStates/services";
import {
  defaultToEmptyString,
  defaultToUS,
  defaultToZero,
  getAgeFromIdentity,
  getDomainMatchTypeForHermes,
} from "./helpers";
import { CredentialWithDomainAndSharing } from "./selectors";
import { PhoneType } from "@dashlane/vault-contracts";
const dataModelAutofillView = (
  item: DataModelObject
): Omit<DataModelAutofillView, "vaultType"> => ({
  id: item.Id,
  lastUse: item.LastUse,
  localeFormat: item.LocaleFormat,
  spaceId: item.SpaceId,
});
export const addressAutofillView = (address: Address): AddressAutofillView => {
  return {
    ...dataModelAutofillView(address),
    vaultType: VaultSourceType.Address,
    addressFull: defaultToEmptyString(address.AddressFull),
    addressName: defaultToEmptyString(address.AddressName),
    building: defaultToEmptyString(address.Building),
    city: defaultToEmptyString(address.City),
    country: defaultToEmptyString(address.Country),
    digitCode: defaultToEmptyString(address.DigitCode),
    door: defaultToEmptyString(address.Door),
    floor: defaultToEmptyString(address.Floor),
    stairs: defaultToEmptyString(address.Stairs),
    state: findStateName(defaultToEmptyString(address.State)),
    stateCode: findStateCode(
      defaultToEmptyString(address.LocaleFormat),
      defaultToEmptyString(address.State)
    ),
    stateLevel2: findStateLevel2Name(defaultToEmptyString(address.StateLevel2)),
    streetName: defaultToEmptyString(address.StreetName),
    streetNumber: defaultToEmptyString(address.StreetNumber),
    streetTitle: defaultToEmptyString(address.StreetTitle),
    zipCode: defaultToEmptyString(address.ZipCode),
  };
};
export const addressListView = (addresses: Address[]): AddressAutofillView[] =>
  addresses.map(addressAutofillView);
export const bankAccountAutofillView = (
  bankAccount: BankAccount
): BankAccountAutofillView => {
  const bankInfo = getBankInfoFromBankAccountData(bankAccount);
  return {
    ...dataModelAutofillView(bankAccount),
    vaultType: VaultSourceType.BankAccount,
    name: defaultToEmptyString(bankAccount.BankAccountName),
    owner: defaultToEmptyString(bankAccount.BankAccountOwner),
    IBAN: defaultToEmptyString(bankAccount.BankAccountIBAN),
    BIC: defaultToEmptyString(bankAccount.BankAccountBIC),
    bank: bankInfo.bank,
    country: defaultToUS(bankAccount.LocaleFormat),
    bankCode: bankInfo.bankCode,
  };
};
export const bankAccountListView = (
  bankAccounts: BankAccount[]
): BankAccountAutofillView[] => bankAccounts.map(bankAccountAutofillView);
export const companyAutofillView = (company: Company): CompanyAutofillView => {
  return {
    ...dataModelAutofillView(company),
    vaultType: VaultSourceType.Company,
    name: defaultToEmptyString(company.Name),
    jobTitle: defaultToEmptyString(company.JobTitle),
  };
};
export const companyListView = (companies: Company[]): CompanyAutofillView[] =>
  companies.map(companyAutofillView);
export const credentialAutofillView = (
  rootDomain: string,
  credential: Credential,
  sharingStatus: SharingStatusItem
): CredentialAutofillView => {
  return {
    ...dataModelAutofillView(credential),
    vaultType: VaultSourceType.Credential,
    autoProtected: defaultTo(false, credential.AutoProtected),
    autoLogin: defaultTo(false, credential.AutoLogin),
    email: defaultToEmptyString(credential.Email),
    hasOtp: Boolean(credential.OtpSecret) || Boolean(credential.OtpUrl),
    matchType: getDomainMatchTypeForHermes(rootDomain, credential),
    login: defaultToEmptyString(credential.Login),
    otpSecret: defaultToEmptyString(credential.OtpSecret),
    otpUrl: defaultToEmptyString(credential.OtpUrl),
    password: defaultToEmptyString(credential.Password),
    subdomainOnly: credential.SubdomainOnly || false,
    sharingStatus,
    title: defaultToEmptyString(
      credential.Title || getDomainForCredential(credential)
    ),
    secondaryLogin: credential.SecondaryLogin,
    url: defaultToEmptyString(credential.Url),
    userAddedLinkedWebsites: getUserAddedLinkedWebsiteDomains(credential),
  };
};
export const credentialListView = (
  credentialsWithDomain: CredentialWithDomainAndSharing[]
): CredentialAutofillView[] =>
  credentialsWithDomain.map(({ domain, credential, sharingStatus }) =>
    credentialAutofillView(domain, credential, sharingStatus)
  );
export const driverLicenseAutofillView = (
  driverLicenseWithIdentity: DriverLicenseWithIdentity
): DriverLicenseAutofillView => {
  const expirationDate = epochToDate(
    vaultDateToViewDate(driverLicenseWithIdentity.ExpireDate)
  );
  const issueDate = epochToDate(
    vaultDateToViewDate(driverLicenseWithIdentity.DeliveryDate)
  );
  return {
    ...dataModelAutofillView(driverLicenseWithIdentity),
    vaultType: VaultSourceType.DriverLicense,
    country: vaultCountryToViewCountry(driverLicenseWithIdentity.LocaleFormat),
    creationDate: defaultToZero(driverLicenseWithIdentity.CreationDatetime),
    expirationDay: expirationDate.getDate(),
    expirationMonth: expirationDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET,
    expirationYear: expirationDate.getFullYear(),
    expirationDateFull: `${expirationDate.getFullYear()}-${
      expirationDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET
    }-${expirationDate.getDate()}`,
    idNumber: defaultToEmptyString(driverLicenseWithIdentity.Number),
    issueDay: issueDate.getDate(),
    issueMonth: issueDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET,
    issueYear: issueDate.getFullYear(),
    issueDateFull: `${issueDate.getFullYear()}-${
      issueDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET
    }-${issueDate.getDate()}`,
    name:
      identityToName(driverLicenseWithIdentity.identity) ||
      driverLicenseWithIdentity.Fullname ||
      "",
    spaceId: driverLicenseWithIdentity.SpaceId,
    state: driverLicenseWithIdentity.State,
  };
};
export const driverLicenseListView = (
  driverLicensesWithIdentity: DriverLicenseWithIdentity[]
): DriverLicenseAutofillView[] =>
  driverLicensesWithIdentity.map(driverLicenseAutofillView);
export const emailAutofillView = (email: Email): EmailAutofillView => {
  return {
    ...dataModelAutofillView(email),
    vaultType: VaultSourceType.Email,
    email: defaultToEmptyString(email.Email),
    name: defaultToEmptyString(email.EmailName),
    type: email.Type || "NO_TYPE",
  };
};
export const emailListView = (emails: Email[]): EmailAutofillView[] =>
  emails.map(emailAutofillView);
export const fiscalIdAutofillView = (
  fiscalId: FiscalId
): FiscalIdAutofillView => {
  return {
    ...dataModelAutofillView(fiscalId),
    vaultType: VaultSourceType.FiscalId,
    country: vaultCountryToViewCountry(fiscalId.LocaleFormat),
    idNumber: defaultToEmptyString(fiscalId.FiscalNumber),
    teledeclarantNumber: defaultToEmptyString(fiscalId.TeledeclarantNumber),
    creationDate: defaultToZero(fiscalId.CreationDatetime),
  };
};
export const fiscalIdListView = (
  fiscalIds: FiscalId[]
): FiscalIdAutofillView[] => fiscalIds.map(fiscalIdAutofillView);
export const generatedPasswordAutofillView = (
  generatedPassword: GeneratedPassword
): GeneratedPasswordAutofillView => {
  return {
    vaultType: VaultSourceType.GeneratedPassword,
    domain: defaultToEmptyString(generatedPassword.Domain),
    generatedDate: generatedPassword.GeneratedDate,
    password: generatedPassword.Password,
    id: generatedPassword.Id,
  };
};
export const generatedPasswordListView = (
  generatedPasswords: GeneratedPassword[]
): GeneratedPasswordAutofillView[] =>
  generatedPasswords.map(generatedPasswordAutofillView);
export const identityAutofillView = (
  identity: Identity
): IdentityAutofillView => {
  return {
    ...dataModelAutofillView(identity),
    vaultType: VaultSourceType.Identity,
    age: getAgeFromIdentity(identity),
    birthDate: defaultToEmptyString(identity.BirthDate),
    birthPlace: defaultToEmptyString(identity.BirthPlace),
    firstName: defaultToEmptyString(identity.FirstName),
    lastName2: defaultToEmptyString(identity.LastName2),
    lastName: defaultToEmptyString(identity.LastName),
    middleName: defaultToEmptyString(identity.MiddleName),
    middleNameInitial: defaultToEmptyString(identity.MiddleName),
    pseudo: defaultToEmptyString(identity.Pseudo),
    title: identity.Title,
  };
};
export const identityListView = (
  identities: Identity[]
): IdentityAutofillView[] => identities.map(identityAutofillView);
export const idCardAutofillView = (
  idCardWithIdentity: IdCardWithIdentity
): IdCardAutofillView => {
  const expirationDate = epochToDate(
    vaultDateToViewDate(idCardWithIdentity.ExpireDate)
  );
  const issueDate = epochToDate(
    vaultDateToViewDate(idCardWithIdentity.DeliveryDate)
  );
  return {
    ...dataModelAutofillView(idCardWithIdentity),
    vaultType: VaultSourceType.IdCard,
    country: vaultCountryToViewCountry(idCardWithIdentity.LocaleFormat),
    creationDate: defaultToZero(idCardWithIdentity.CreationDatetime),
    expirationDay: expirationDate.getDate(),
    expirationMonth: expirationDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET,
    expirationYear: expirationDate.getFullYear(),
    expirationDateFull: `${expirationDate.getFullYear()}-${
      expirationDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET
    }-${expirationDate.getDate()}`,
    idNumber: defaultToEmptyString(idCardWithIdentity.Number),
    issueDay: issueDate.getDate(),
    issueMonth: issueDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET,
    issueYear: issueDate.getFullYear(),
    issueDateFull: `${issueDate.getFullYear()}-${
      issueDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET
    }-${issueDate.getDate()}`,
    name:
      identityToName(idCardWithIdentity.identity) ||
      idCardWithIdentity.Fullname ||
      "",
    spaceId: idCardWithIdentity.SpaceId,
  };
};
export const idCardListView = (
  idCardsWithIdentity: IdCardWithIdentity[]
): IdCardAutofillView[] => idCardsWithIdentity.map(idCardAutofillView);
export const noteAutofillView = (note: Note): NoteAutofillView => {
  return {
    ...dataModelAutofillView(note),
    vaultType: VaultSourceType.Note,
  };
};
export const noteListView = (notes: Note[]): NoteAutofillView[] =>
  notes.map(noteAutofillView);
export const passportAutofillView = (
  passportWithIdentity: PassportWithIdentity
): PassportAutofillView => {
  const expirationDate = epochToDate(
    vaultDateToViewDate(passportWithIdentity.ExpireDate)
  );
  const issueDate = epochToDate(
    vaultDateToViewDate(passportWithIdentity.DeliveryDate)
  );
  return {
    ...dataModelAutofillView(passportWithIdentity),
    vaultType: VaultSourceType.Passport,
    idNumber: defaultToEmptyString(passportWithIdentity.Number),
    country: vaultCountryToViewCountry(passportWithIdentity.LocaleFormat),
    expirationDay: expirationDate.getDate(),
    expirationMonth: expirationDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET,
    expirationYear: expirationDate.getFullYear(),
    expirationDateFull: `${expirationDate.getFullYear()}-${
      expirationDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET
    }-${expirationDate.getDate()}`,
    issueDay: issueDate.getDate(),
    issueMonth: issueDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET,
    issueYear: issueDate.getFullYear(),
    issueDateFull: `${issueDate.getFullYear()}-${
      issueDate.getMonth() + ZERO_INDEX_BASED_MONTH_OFFSET
    }-${issueDate.getDate()}`,
    name:
      identityToName(passportWithIdentity.identity) ||
      passportWithIdentity.Fullname ||
      "",
    deliveryPlace: defaultToEmptyString(passportWithIdentity.DeliveryPlace),
    creationDate: defaultToZero(passportWithIdentity.CreationDatetime),
  };
};
export const passportListView = (
  passports: PassportWithIdentity[]
): PassportAutofillView[] => passports.map(passportAutofillView);
export const paymentCardAutofillView = (
  paymentCard: PaymentCard
): PaymentCardAutofillView => {
  return {
    ...dataModelAutofillView(paymentCard),
    vaultType: VaultSourceType.PaymentCard,
    bank: defaultToEmptyString(paymentCard.Bank),
    cardNumber: defaultToEmptyString(paymentCard.CardNumber),
    cardNumberLastDigits: getLastDigitsFromCardNumber(paymentCard.CardNumber),
    color: paymentCard.Color || defaultColor,
    expireMonth: defaultToEmptyString(paymentCard.ExpireMonth),
    expireYear: defaultToEmptyString(paymentCard.ExpireYear),
    name: defaultToEmptyString(paymentCard.Name),
    ownerName: defaultToEmptyString(paymentCard.OwnerName),
    securityCode: defaultToEmptyString(paymentCard.SecurityCode),
    type: paymentCard.Type,
  };
};
export const paymentCardListView = (
  paymentCards: PaymentCard[]
): PaymentCardAutofillView[] => paymentCards.map(paymentCardAutofillView);
export const personalWebsiteAutofillView = (
  website: PersonalWebsite
): PersonalWebsiteAutofillView => {
  return {
    ...dataModelAutofillView(website),
    vaultType: VaultSourceType.PersonalWebsite,
    name: defaultToEmptyString(website.Name),
    website: defaultToEmptyString(website.Website),
  };
};
export const personalWebsiteListView = (
  phones: PersonalWebsite[]
): PersonalWebsiteAutofillView[] => phones.map(personalWebsiteAutofillView);
const PhoneTypeDictionary = {
  [CarbonPhoneType.PHONE_TYPE_ANY]: PhoneType.Any,
  [CarbonPhoneType.PHONE_TYPE_FAX]: PhoneType.Fax,
  [CarbonPhoneType.PHONE_TYPE_LANDLINE]: PhoneType.Landline,
  [CarbonPhoneType.PHONE_TYPE_MOBILE]: PhoneType.Mobile,
  [CarbonPhoneType.PHONE_TYPE_WORK_FAX]: PhoneType.WorkFax,
  [CarbonPhoneType.PHONE_TYPE_WORK_LANDLINE]: PhoneType.WorkLandline,
  [CarbonPhoneType.PHONE_TYPE_WORK_MOBILE]: PhoneType.WorkMobile,
};
export const phoneAutofillView = (phone: Phone): PhoneAutofillView => {
  return {
    ...dataModelAutofillView(phone),
    vaultType: VaultSourceType.Phone,
    name: defaultToEmptyString(phone.PhoneName),
    numberInternational: defaultToEmptyString(phone.NumberNational),
    number: defaultToEmptyString(phone.Number),
    type: PhoneTypeDictionary[phone.Type],
  };
};
export const phoneListView = (phones: Phone[]): PhoneAutofillView[] =>
  phones.map(phoneAutofillView);
export const socialSecurityIdAutofillView = (
  socialSecurityId: SocialSecurityIdWithIdentity
): SocialSecurityIdAutofillView => {
  return {
    ...dataModelAutofillView(socialSecurityId),
    vaultType: VaultSourceType.SocialSecurityId,
    name:
      identityToName(socialSecurityId.identity) ||
      socialSecurityId.SocialSecurityFullname ||
      "",
    idNumber: defaultToEmptyString(socialSecurityId.SocialSecurityNumber),
    country: vaultCountryToViewCountry(socialSecurityId.LocaleFormat),
    creationDate: defaultToZero(socialSecurityId.CreationDatetime),
  };
};
export const socialSecurityIdListView = (
  socialSecurityIds: SocialSecurityIdWithIdentity[]
): SocialSecurityIdAutofillView[] =>
  socialSecurityIds.map(socialSecurityIdAutofillView);
export const passkeyAutofillView = (passkey: Passkey): PasskeyAutofillView => {
  return {
    ...dataModelAutofillView(passkey),
    credentialId: passkey.CredentialId,
    rpId: passkey.RpId,
    rpName: passkey.RpName,
    userDisplayName: passkey.UserDisplayName,
    userHandle: passkey.UserHandle,
    vaultType: VaultSourceType.Passkey,
    counter: passkey.Counter,
    keyAlgorithm: passkey.KeyAlgorithm,
  };
};
