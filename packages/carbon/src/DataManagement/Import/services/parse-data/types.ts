import {
  BankAccount,
  Credential,
  ImportSource,
  Note,
  PaymentCard,
  SupportedVaultItemKeys,
  SupportedVaultItems,
  SupportedVaultTypes,
} from "@dashlane/communication";
export const SECURE_NOTES_HEADERS: HeaderWithAliases<Note> = {
  Title: new Set(["title", "name"]),
  Content: new Set(["note", "notes", "comments", "extra", "content"]),
  Category: new Set([
    "category",
    "grouping",
    "tags",
    "folders",
    "folder",
    "tag",
    "collection",
    "collections",
  ]),
};
export const CREDENTIAL_HEADERS: HeaderWithAliases<Credential> = {
  Title: new Set(["title", "name", "account", "site name"]),
  Login: new Set([
    "username",
    "login",
    "login_username",
    "login name",
    "user name",
  ]),
  Url: new Set([
    "url",
    "website",
    "domain",
    "login_url",
    "login url",
    "login_uri",
    "web site",
    "website address",
  ]),
  Email: new Set(["email"]),
  Password: new Set(["password", "login_password"]),
  OtpUrl: new Set([
    "first one-time password",
    "login_otp",
    "login_totp",
    "otp",
    "otpauth",
    "otpurl",
    "otpsecret",
    "totp",
  ]),
  Note: new Set(["note", "notes", "comments", "extra"]),
  Category: new Set([
    "category",
    "grouping",
    "tags",
    "folders",
    "folder",
    "tag",
    "collection",
    "collections",
  ]),
};
export const PAYMENT_CARD_HEADERS: HeaderWithAliases<PaymentCard> = {
  CardNumber: new Set(["number", "cardnumber", "cc_number"]),
  CCNote: new Set(["notes", "ccnote", "note"]),
  OwnerName: new Set(["name on card", "ownername", "account_name"]),
  SecurityCode: new Set(["security code", "securitycode", "code"]),
  ExpireMonth: new Set(["exp_month", "expiremonth", "expiration_month"]),
  ExpireYear: new Set(["exp_year", "expireyear", "expiration_year"]),
  Name: new Set(["name"]),
};
export const BANK_ACCOUNT_HEADERS: HeaderWithAliases<BankAccount> = {
  BankAccountName: new Set(["bank name", "bankaccountname", "account_name"]),
  BankAccountIBAN: new Set([
    "iban number",
    "account number",
    "account_number",
    "bankaccountiban",
  ]),
  BankAccountBIC: new Set([
    "swift code",
    "routing number",
    "routing_number",
    "bankaccountbic",
  ]),
  BankAccountOwner: new Set(["account_holder"]),
  BankAccountBank: new Set(["issuing_bank"]),
  LocaleFormat: new Set(["country"]),
};
export const HEADER_MAPPINGS: Record<
  SupportedVaultTypes,
  Record<string, Set<string>>
> = {
  [SupportedVaultTypes.CREDENTIAL]: CREDENTIAL_HEADERS,
  [SupportedVaultTypes.NOTE]: SECURE_NOTES_HEADERS,
  [SupportedVaultTypes.PAYMENT_CARD]: PAYMENT_CARD_HEADERS,
  [SupportedVaultTypes.BANK_ACCOUNT]: BANK_ACCOUNT_HEADERS,
  [SupportedVaultTypes.COLLECTION]: {},
};
export const TYPE_HEADERS = new Set(["type", "item type"]);
export const TYPE_MAPPINGS: Record<SupportedVaultTypes, string[]> = {
  [SupportedVaultTypes.NOTE]: ["securenote", "note", "secure note"],
  [SupportedVaultTypes.CREDENTIAL]: ["password", "login", "credential"],
  [SupportedVaultTypes.BANK_ACCOUNT]: ["bankaccount", "bank"],
  [SupportedVaultTypes.PAYMENT_CARD]: [
    "paymentcard",
    "payment_card",
    "creditcard",
    "debitcard",
  ],
  [SupportedVaultTypes.COLLECTION]: [],
};
export interface ImportDataStructure {
  data: string;
  importSource: ImportSource;
}
export type ColumnObject = {
  supported: boolean;
  index: number;
};
export type FieldToIndexMap = Partial<
  Record<SupportedVaultItemKeys, ColumnObject>
>;
export type HeaderWithAliases<
  T extends SupportedVaultItems[keyof SupportedVaultItems]
> = Partial<Record<keyof T, Set<string>>>;
