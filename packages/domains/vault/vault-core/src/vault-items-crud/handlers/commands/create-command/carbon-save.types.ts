import {
  IdentityTitle as CarbonIdentityTitle,
  PaymentCardColor as CarbonPaymentCardColor,
  PhoneType as CarbonPhoneType,
  DriverLicenseUpdateModel,
  FiscalIdUpdateModel,
  IdCardUpdateModel,
  PassportUpdateModel,
  SocialSecurityIdUpdateModel,
} from "@dashlane/communication";
import {
  Address,
  BankAccount,
  Company,
  Country,
  Credential,
  DriversLicense,
  Email,
  FiscalId,
  IdCard,
  Identity,
  IdentityTitle,
  Passkey,
  Passport,
  PaymentCard,
  PaymentCardColorType,
  Phone,
  PhoneType,
  Secret,
  SecureNote,
  SocialSecurityId,
  VaultItemType,
  Website,
} from "@dashlane/vault-contracts";
interface SaveAddressCarbonType
  extends Partial<Omit<Address, "itemName" | "linkedPhoneId">> {
  addressFull?: string;
  addressName?: string;
  linkedPhone?: string;
}
interface SaveBankAccountCarbonType
  extends Partial<Omit<BankAccount, "accountName" | "bankCode" | "ownerName">> {
  bank?: string;
  owner?: string;
  name?: string;
}
interface SaveCompanyCarbonType extends Partial<Omit<Company, "companyName">> {
  name?: string;
}
interface SaveCredentialCarbonType
  extends Partial<
    Omit<
      Credential,
      | "alternativeUsername"
      | "itemName"
      | "linkedURLs"
      | "otpURL"
      | "URL"
      | "username"
    >
  > {
  login?: string;
  otpUrl?: string;
  secondaryLogin?: string;
  title?: string;
  url?: string;
  linkedWebsites?: {
    addedByUser?: string[];
  };
}
interface SaveSecretCarbonType extends Partial<Secret> {
  secured?: boolean;
}
interface SaveEmailCarbonType
  extends Partial<Omit<Email, "itemName" | "emailAddress">> {
  emailName?: string;
  email?: string;
}
interface SaveIdentityCarbonType extends Partial<Omit<Identity, "title">> {
  title?: CarbonIdentityTitle;
}
const IdentityTitleToCarbonIdentityTitleDictionary: Record<
  IdentityTitle,
  CarbonIdentityTitle
> = {
  [IdentityTitle.Mr]: "MR",
  [IdentityTitle.Mrs]: "MME",
  [IdentityTitle.Miss]: "MLLE",
  [IdentityTitle.Ms]: "MS",
  [IdentityTitle.Mx]: "MX",
  [IdentityTitle.NoneOfThese]: "NONE_OF_THESE",
};
interface SavePaymentCardCarbonType
  extends Partial<Omit<PaymentCard, "color" | "itemName" | "note">> {
  cardName?: string;
  color?: CarbonPaymentCardColor;
  personalNote?: string;
}
const CardColorTypeToCarbonCardColorTypeDictionary: Record<
  PaymentCardColorType,
  CarbonPaymentCardColor
> = {
  [PaymentCardColorType.Black]: CarbonPaymentCardColor.BLACK,
  [PaymentCardColorType.Blue1]: CarbonPaymentCardColor.BLUE_1,
  [PaymentCardColorType.Blue2]: CarbonPaymentCardColor.BLUE_2,
  [PaymentCardColorType.Gold]: CarbonPaymentCardColor.GOLD,
  [PaymentCardColorType.Green1]: CarbonPaymentCardColor.GREEN_1,
  [PaymentCardColorType.Green2]: CarbonPaymentCardColor.GREEN_2,
  [PaymentCardColorType.Orange]: CarbonPaymentCardColor.ORANGE,
  [PaymentCardColorType.Red]: CarbonPaymentCardColor.RED,
  [PaymentCardColorType.Silver]: CarbonPaymentCardColor.SILVER,
  [PaymentCardColorType.White]: CarbonPaymentCardColor.WHITE,
};
interface SavePhoneCarbonType
  extends Partial<Omit<Phone, "itemName" | "phoneNumber" | "type">> {
  phoneName?: string;
  number?: string;
  type?: CarbonPhoneType;
}
const PhoneTypeToCarbonPhoneTypeDictionary: Record<PhoneType, CarbonPhoneType> =
  {
    [PhoneType.Any]: CarbonPhoneType.PHONE_TYPE_ANY,
    [PhoneType.Fax]: CarbonPhoneType.PHONE_TYPE_FAX,
    [PhoneType.Landline]: CarbonPhoneType.PHONE_TYPE_LANDLINE,
    [PhoneType.Mobile]: CarbonPhoneType.PHONE_TYPE_MOBILE,
    [PhoneType.WorkFax]: CarbonPhoneType.PHONE_TYPE_WORK_FAX,
    [PhoneType.WorkLandline]: CarbonPhoneType.PHONE_TYPE_WORK_LANDLINE,
    [PhoneType.WorkMobile]: CarbonPhoneType.PHONE_TYPE_WORK_MOBILE,
  };
interface SaveWebsiteCarbonType
  extends Partial<Omit<Website, "itemName" | "URL">> {
  name?: string;
  website?: string;
}
type CarbonIdSaveType =
  | DriverLicenseUpdateModel
  | FiscalIdUpdateModel
  | IdCardUpdateModel
  | PassportUpdateModel
  | SocialSecurityIdUpdateModel;
type CarbonSaveType =
  | SaveAddressCarbonType
  | SaveCompanyCarbonType
  | SaveCredentialCarbonType
  | SaveEmailCarbonType
  | SaveIdentityCarbonType
  | SavePhoneCarbonType
  | SaveWebsiteCarbonType
  | CarbonIdSaveType
  | SaveSecretCarbonType;
const parseIdDate = (date?: string) => (date ? Date.parse(date) / 1000 : null);
export const carbonSaveTypeMapperDictionary: Record<
  VaultItemType,
  (content: object) => CarbonSaveType
> = {
  [VaultItemType.Address]: (
    content: Partial<Address>
  ): SaveAddressCarbonType => ({
    addressFull: content.streetName,
    addressName: content.itemName,
    linkedPhone: content.linkedPhoneId,
    ...content,
  }),
  [VaultItemType.BankAccount]: (
    content: Partial<BankAccount>
  ): SaveBankAccountCarbonType => ({
    ...content,
    bank: content.bankCode,
    localeFormat: content.country || Country.US,
    name: content.accountName,
    owner: content.ownerName,
  }),
  [VaultItemType.Company]: (
    content: Partial<Company>
  ): SaveCompanyCarbonType => ({
    name: content.companyName,
    ...content,
  }),
  [VaultItemType.Credential]: (
    content: Partial<Credential>
  ): SaveCredentialCarbonType => ({
    login: content.username,
    otpUrl: content.otpURL,
    otpSecret: content.otpSecret,
    secondaryLogin: content.alternativeUsername,
    title: content.itemName,
    url: content.URL,
    linkedWebsites: {
      addedByUser: content.linkedURLs,
    },
    ...content,
  }),
  [VaultItemType.DriversLicense]: (
    content: Partial<DriversLicense>
  ): DriverLicenseUpdateModel => ({
    ...content,
    country: content.country ?? Country.US,
    expirationDate: parseIdDate(content.expirationDate),
    idNumber: content.idNumber ?? "",
    issueDate: parseIdDate(content.issueDate),
    name: content.idName ?? "",
    spaceId: content.spaceId ?? "",
    state: content.state ?? "",
  }),
  [VaultItemType.Email]: (content: Partial<Email>): SaveEmailCarbonType => ({
    email: content.emailAddress,
    emailName: content.itemName,
    ...content,
  }),
  [VaultItemType.FiscalId]: (
    content: Partial<FiscalId>
  ): FiscalIdUpdateModel => ({
    ...content,
    country: content.country ?? Country.US,
    idNumber: content.fiscalNumber ?? "",
    spaceId: content.spaceId ?? "",
    teledeclarantNumber: content.teledeclarantNumber ?? "",
  }),
  [VaultItemType.IdCard]: (content: Partial<IdCard>): IdCardUpdateModel => ({
    ...content,
    country: content.country ?? Country.US,
    expirationDate: parseIdDate(content.expirationDate),
    idNumber: content.idNumber ?? "",
    issueDate: parseIdDate(content.issueDate),
    name: content.idName ?? "",
    spaceId: content.spaceId ?? "",
  }),
  [VaultItemType.Identity]: (
    content: Partial<Identity>
  ): SaveIdentityCarbonType => ({
    ...content,
    title: content.title
      ? IdentityTitleToCarbonIdentityTitleDictionary[content.title]
      : undefined,
  }),
  [VaultItemType.Passkey]: (content: Partial<Passkey>) => ({ ...content }),
  [VaultItemType.Passport]: (
    content: Partial<Passport>
  ): PassportUpdateModel => ({
    ...content,
    country: content.country ?? Country.US,
    expirationDate: parseIdDate(content.expirationDate),
    idNumber: content.idNumber ?? "",
    issueDate: parseIdDate(content.issueDate),
    name: content.idName ?? "",
    spaceId: content.spaceId ?? "",
    deliveryPlace: content.issuePlace ?? "",
  }),
  [VaultItemType.PaymentCard]: (
    content: Partial<PaymentCard>
  ): SavePaymentCardCarbonType => ({
    ...content,
    cardName: content.itemName,
    color: content.color
      ? CardColorTypeToCarbonCardColorTypeDictionary[content.color]
      : undefined,
    personalNote: content.note,
  }),
  [VaultItemType.Phone]: (content: Partial<Phone>): SavePhoneCarbonType => ({
    ...content,
    phoneName: content.itemName,
    number: content.phoneNumber,
    type: content.type
      ? PhoneTypeToCarbonPhoneTypeDictionary[content.type]
      : undefined,
  }),
  [VaultItemType.Secret]: (content: Partial<Secret>): SaveSecretCarbonType => ({
    ...content,
    secured: content.isSecured,
  }),
  [VaultItemType.SecureNote]: (content: Partial<SecureNote>) => ({
    ...content,
  }),
  [VaultItemType.SocialSecurityId]: (
    content: Partial<SocialSecurityId>
  ): SocialSecurityIdUpdateModel => ({
    ...content,
    country: content.country ?? Country.US,
    idNumber: content.idNumber ?? "",
    name: content.idName ?? "",
    spaceId: content.spaceId ?? "",
  }),
  [VaultItemType.Website]: (
    content: Partial<Website>
  ): SaveWebsiteCarbonType => ({
    name: content.itemName,
    website: content.URL,
    ...content,
  }),
};
