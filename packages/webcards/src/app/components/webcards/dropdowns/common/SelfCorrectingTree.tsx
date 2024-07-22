import {
  AutofillDataSourceType,
  OtherSourceType,
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
export enum OtherCategory {
  Nothing = "Nothing",
}
export const SOURCE_TYPE_TO_LOCALIZATION_KEY: Record<
  VaultSourceType | OtherCategory,
  string
> = {
  [VaultSourceType.Address]: "TR_SELFCORRECT_STEP1_ADDRESS",
  [VaultSourceType.BankAccount]: "TR_SELFCORRECT_STEP1_BANKDETAILS",
  [VaultSourceType.Company]: "TR_SELFCORRECT_STEP2_COMPANYNAME",
  [VaultSourceType.Credential]: "TR_SELFCORRECT_STEP1_LOGININFO",
  [VaultSourceType.DriverLicense]: "TR_SELFCORRECT_STEP1_DRIVERSLICENSE",
  [VaultSourceType.Email]: "TR_SELFCORRECT_STEP2_EMAIL",
  [VaultSourceType.FiscalId]: "TR_SELFCORRECT_STEP2_TAXNUM",
  [VaultSourceType.GeneratedPassword]: "",
  [VaultSourceType.IdCard]: "TR_SELFCORRECT_STEP1_IDCARD",
  [VaultSourceType.Identity]: "TR_SELFCORRECT_STEP1_PERSONALINFO",
  [VaultSourceType.Note]: "",
  [VaultSourceType.NoteCategory]: "",
  [VaultSourceType.Passkey]: "",
  [VaultSourceType.Passport]: "TR_SELFCORRECT_STEP1_PASSPORT",
  [VaultSourceType.PaymentCard]: "TR_SELFCORRECT_STEP1_PAYMENTINFO",
  [VaultSourceType.PersonalWebsite]: "TR_SELFCORRECT_STEP2_WEBSITE",
  [VaultSourceType.Phone]: "TR_SELFCORRECT_STEP2_PHONENUM",
  [VaultSourceType.SocialSecurityId]: "TR_SELFCORRECT_STEP2_SSN",
  [VaultSourceType.Secret]: "",
  [OtherCategory.Nothing]: "TR_SELFCORRECT_STEP1_DONT_AUTOFILL",
};
export enum SelfCorrectingAutofillWebcardStep {
  Categories = "categories",
  Options = "options",
}
export interface SelfCorrectingAutofillCategoryItem {
  readonly itemType: VaultSourceType | OtherCategory;
  readonly localizationKey: string;
}
type SomeSelfCorrectingAutofillOptionItem<T extends AutofillDataSourceType> = {
  readonly itemType: T;
  readonly itemProperty: T extends VaultSourceType
    ? keyof VaultAutofillViewInterfaces[T]
    : T;
  readonly localizationKey: string;
};
type AllSelfCorrectingAutofillOptionItem<T> = T extends AutofillDataSourceType
  ? SomeSelfCorrectingAutofillOptionItem<T>
  : never;
export type SelfCorrectingAutofillOptionItem =
  AllSelfCorrectingAutofillOptionItem<AutofillDataSourceType>;
export type SelfCorrectingAutofillCardItem =
  | SelfCorrectingAutofillCategoryItem
  | SelfCorrectingAutofillOptionItem;
export const FIRST_STEP_CARDS: SelfCorrectingAutofillCategoryItem[] = [
  {
    itemType: VaultSourceType.Credential,
    localizationKey:
      SOURCE_TYPE_TO_LOCALIZATION_KEY[VaultSourceType.Credential],
  },
  {
    itemType: VaultSourceType.PaymentCard,
    localizationKey:
      SOURCE_TYPE_TO_LOCALIZATION_KEY[VaultSourceType.PaymentCard],
  },
  {
    itemType: VaultSourceType.Identity,
    localizationKey: SOURCE_TYPE_TO_LOCALIZATION_KEY[VaultSourceType.Identity],
  },
  {
    itemType: VaultSourceType.Address,
    localizationKey: SOURCE_TYPE_TO_LOCALIZATION_KEY[VaultSourceType.Address],
  },
  {
    itemType: VaultSourceType.Passport,
    localizationKey: SOURCE_TYPE_TO_LOCALIZATION_KEY[VaultSourceType.Passport],
  },
  {
    itemType: VaultSourceType.IdCard,
    localizationKey: SOURCE_TYPE_TO_LOCALIZATION_KEY[VaultSourceType.IdCard],
  },
  {
    itemType: VaultSourceType.DriverLicense,
    localizationKey:
      SOURCE_TYPE_TO_LOCALIZATION_KEY[VaultSourceType.DriverLicense],
  },
  {
    itemType: VaultSourceType.BankAccount,
    localizationKey:
      SOURCE_TYPE_TO_LOCALIZATION_KEY[VaultSourceType.BankAccount],
  },
  {
    itemType: OtherCategory.Nothing,
    localizationKey: SOURCE_TYPE_TO_LOCALIZATION_KEY[OtherCategory.Nothing],
  },
];
export const SECOND_STEP_CARDS: Partial<
  Record<VaultSourceType, SelfCorrectingAutofillOptionItem[]>
> = {
  [VaultSourceType.Credential]: [
    {
      itemType: VaultSourceType.Credential,
      itemProperty: "email",
      localizationKey: "TR_SELFCORRECT_STEP2_EMAIL",
    },
    {
      itemType: VaultSourceType.Credential,
      itemProperty: "login",
      localizationKey: "TR_SELFCORRECT_STEP2_LOGIN",
    },
    {
      itemType: VaultSourceType.Credential,
      itemProperty: "secondaryLogin",
      localizationKey: "TR_SELFCORRECT_STEP2_LOGIN_SECONDARY",
    },
    {
      itemType: VaultSourceType.Credential,
      itemProperty: "password",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSWORD_CURRENT",
    },
    {
      itemType: OtherSourceType.NewPassword,
      itemProperty: OtherSourceType.NewPassword,
      localizationKey: "TR_SELFCORRECT_STEP2_PASSWORD_NEW",
    },
    {
      itemType: OtherSourceType.NewPassword,
      itemProperty: OtherSourceType.NewPassword,
      localizationKey: "TR_SELFCORRECT_STEP2_PASSWORD_CONFIRM",
    },
    {
      itemType: VaultSourceType.Credential,
      itemProperty: "otpSecret",
      localizationKey: "TR_SELFCORRECT_STEP2_OTP",
    },
  ],
  [VaultSourceType.PaymentCard]: [
    {
      itemType: VaultSourceType.PaymentCard,
      itemProperty: "cardNumber",
      localizationKey: "TR_SELFCORRECT_STEP2_CREDITCARDNUM",
    },
    {
      itemType: VaultSourceType.PaymentCard,
      itemProperty: "expireMonth",
      localizationKey: "TR_SELFCORRECT_STEP2_CREDITCARDEXP_MONTH",
    },
    {
      itemType: VaultSourceType.PaymentCard,
      itemProperty: "expireYear",
      localizationKey: "TR_SELFCORRECT_STEP2_CREDITCARDEXP_YEAR",
    },
    {
      itemType: VaultSourceType.PaymentCard,
      itemProperty: "securityCode",
      localizationKey: "TR_SELFCORRECT_STEP2_CREDITCARDCCV",
    },
    {
      itemType: VaultSourceType.PaymentCard,
      itemProperty: "ownerName",
      localizationKey: "TR_SELFCORRECT_STEP2_CREDITCARDOWNER",
    },
    {
      itemType: VaultSourceType.PaymentCard,
      itemProperty: "bank",
      localizationKey: "TR_SELFCORRECT_STEP2_CREDITCARDBANK",
    },
  ],
  [VaultSourceType.Identity]: [
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "fullName",
      localizationKey: "TR_SELFCORRECT_STEP2_FULLNAME",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "firstName",
      localizationKey: "TR_SELFCORRECT_STEP2_FIRSTNAME",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "middleName",
      localizationKey: "TR_SELFCORRECT_STEP2_MIDDLENAME",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "middleNameInitial",
      localizationKey: "TR_SELFCORRECT_STEP2_MIDDLENAMEINITIAL",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "lastName",
      localizationKey: "TR_SELFCORRECT_STEP2_LASTNAME",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "age",
      localizationKey: "TR_SELFCORRECT_STEP2_AGE",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "birthDate",
      localizationKey: "TR_SELFCORRECT_STEP2_DOB",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "birthPlace",
      localizationKey: "TR_SELFCORRECT_STEP2_POB",
    },
    {
      itemType: VaultSourceType.Email,
      itemProperty: "email",
      localizationKey: "TR_SELFCORRECT_STEP2_EMAIL",
    },
    {
      itemType: VaultSourceType.Phone,
      itemProperty: "number",
      localizationKey: "TR_SELFCORRECT_STEP2_PHONENUM",
    },
    {
      itemType: VaultSourceType.Phone,
      itemProperty: "number",
      localizationKey: "TR_SELFCORRECT_STEP2_PHONENUMEXT",
    },
    {
      itemType: VaultSourceType.Phone,
      itemProperty: "numberInternational",
      localizationKey: "TR_SELFCORRECT_STEP2_COUNTRYCODE",
    },
    {
      itemType: VaultSourceType.SocialSecurityId,
      itemProperty: "idNumber",
      localizationKey: "TR_SELFCORRECT_STEP2_SSN",
    },
    {
      itemType: VaultSourceType.FiscalId,
      itemProperty: "idNumber",
      localizationKey: "TR_SELFCORRECT_STEP2_TAXNUM",
    },
    {
      itemType: VaultSourceType.Company,
      itemProperty: "name",
      localizationKey: "TR_SELFCORRECT_STEP2_COMPANYNAME",
    },
    {
      itemType: VaultSourceType.Company,
      itemProperty: "jobTitle",
      localizationKey: "TR_SELFCORRECT_STEP2_JOBPOSITION",
    },
    {
      itemType: VaultSourceType.PersonalWebsite,
      itemProperty: "website",
      localizationKey: "TR_SELFCORRECT_STEP2_WEBSITE",
    },
  ],
  [VaultSourceType.Address]: [
    {
      itemType: VaultSourceType.Address,
      itemProperty: "addressFull",
      localizationKey: "TR_SELFCORRECT_STEP2_AL1",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "zipCode",
      localizationKey: "TR_SELFCORRECT_STEP2_ZIP",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "city",
      localizationKey: "TR_SELFCORRECT_STEP2_CITY",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "country",
      localizationKey: "TR_SELFCORRECT_STEP2_COUNTRY",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "door",
      localizationKey: "TR_SELFCORRECT_STEP2_APTNUM",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "floor",
      localizationKey: "TR_SELFCORRECT_STEP2_FLOOR",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "streetNumber",
      localizationKey: "TR_SELFCORRECT_STEP2_STREETNUM",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "streetTitle",
      localizationKey: "TR_SELFCORRECT_STEP2_STREETTYPE",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "addressFull",
      localizationKey: "TR_SELFCORRECT_STEP2_STREETNAME",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "state",
      localizationKey: "TR_SELFCORRECT_STEP2_STATE",
    },
    {
      itemType: VaultSourceType.Address,
      itemProperty: "stateCode",
      localizationKey: "TR_SELFCORRECT_STEP2_STATECODE",
    },
  ],
  [VaultSourceType.Passport]: [
    {
      itemType: VaultSourceType.Passport,
      itemProperty: "idNumber",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSPORTNUM",
    },
    {
      itemType: VaultSourceType.Passport,
      itemProperty: "name",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSPORTHOLDER_LASTNAME",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "birthDate",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSPORTDOB",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "title",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSPORTGENDER",
    },
    {
      itemType: VaultSourceType.Passport,
      itemProperty: "issueDateFull",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSPORTDELIVERY",
    },
    {
      itemType: VaultSourceType.Passport,
      itemProperty: "expirationDateFull",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSPORTEXP",
    },
    {
      itemType: VaultSourceType.Passport,
      itemProperty: "deliveryPlace",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSPORTLOCATION",
    },
    {
      itemType: VaultSourceType.Passport,
      itemProperty: "country",
      localizationKey: "TR_SELFCORRECT_STEP2_PASSPORTNATIONALITY",
    },
  ],
  [VaultSourceType.IdCard]: [
    {
      itemType: VaultSourceType.IdCard,
      itemProperty: "idNumber",
      localizationKey: "TR_SELFCORRECT_STEP2_IDCARDNUM",
    },
    {
      itemType: VaultSourceType.IdCard,
      itemProperty: "name",
      localizationKey: "TR_SELFCORRECT_STEP2_IDCARDHOLDER",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "birthDate",
      localizationKey: "TR_SELFCORRECT_STEP2_IDCARDDOB",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "title",
      localizationKey: "TR_SELFCORRECT_STEP2_IDCARDGENDER",
    },
    {
      itemType: VaultSourceType.IdCard,
      itemProperty: "issueDateFull",
      localizationKey: "TR_SELFCORRECT_STEP2_IDCARDDELIVERY",
    },
    {
      itemType: VaultSourceType.IdCard,
      itemProperty: "expirationDateFull",
      localizationKey: "TR_SELFCORRECT_STEP2_IDCARDEXP",
    },
    {
      itemType: VaultSourceType.IdCard,
      itemProperty: "country",
      localizationKey: "TR_SELFCORRECT_STEP2_IDCARDNATIONALITY",
    },
  ],
  [VaultSourceType.DriverLicense]: [
    {
      itemType: VaultSourceType.DriverLicense,
      itemProperty: "idNumber",
      localizationKey: "TR_SELFCORRECT_STEP2_DRIVERNUM",
    },
    {
      itemType: VaultSourceType.DriverLicense,
      itemProperty: "name",
      localizationKey: "TR_SELFCORRECT_STEP2_DRIVERNAME",
    },
    {
      itemType: VaultSourceType.Identity,
      itemProperty: "title",
      localizationKey: "TR_SELFCORRECT_STEP2_DRIVERGENDER",
    },
    {
      itemType: VaultSourceType.DriverLicense,
      itemProperty: "issueDateFull",
      localizationKey: "TR_SELFCORRECT_STEP2_DRIVERDELIVERY",
    },
    {
      itemType: VaultSourceType.DriverLicense,
      itemProperty: "expirationDateFull",
      localizationKey: "TR_SELFCORRECT_STEP2_DRIVEREXP",
    },
    {
      itemType: VaultSourceType.DriverLicense,
      itemProperty: "state",
      localizationKey: "TR_SELFCORRECT_STEP2_DRIVERSTATE",
    },
  ],
  [VaultSourceType.BankAccount]: [
    {
      itemType: VaultSourceType.BankAccount,
      itemProperty: "IBAN",
      localizationKey: "TR_SELFCORRECT_STEP2_BANKACCOUNTNUM",
    },
    {
      itemType: VaultSourceType.BankAccount,
      itemProperty: "owner",
      localizationKey: "TR_SELFCORRECT_STEP2_BANKACCOUNTHOLDER",
    },
    {
      itemType: VaultSourceType.BankAccount,
      itemProperty: "bank",
      localizationKey: "TR_SELFCORRECT_STEP2_BANKNAME",
    },
    {
      itemType: VaultSourceType.BankAccount,
      itemProperty: "IBAN",
      localizationKey: "TR_SELFCORRECT_STEP2_IBAN",
    },
    {
      itemType: VaultSourceType.BankAccount,
      itemProperty: "BIC",
      localizationKey: "TR_SELFCORRECT_STEP2_ROUTING_NUMBER",
    },
    {
      itemType: VaultSourceType.BankAccount,
      itemProperty: "BIC",
      localizationKey: "TR_SELFCORRECT_STEP2_SORT_CODE",
    },
  ],
};
