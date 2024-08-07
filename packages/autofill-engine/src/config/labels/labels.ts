import { AutofillDataSourceRef } from "@dashlane/autofill-contracts";
export const FORM_LABELS = [
  "login",
  "register",
  "identity",
  "change_password",
  "payment",
  "billing",
  "shipping",
  "forgot_password",
  "contact",
  "newsletter",
  "search",
  "shopping_basket",
  "other",
  "default",
] as const;
export type FormLabelsType = (typeof FORM_LABELS)[number];
const NON_ML_MAIN_LABELS = ["webauthn"] as const;
export const FIELD_MAIN_LABELS = [
  "action",
  "address",
  "age",
  "captcha",
  "company",
  "consent",
  "date",
  "email",
  "id_document",
  "name",
  "other",
  "otp",
  "password",
  "payment",
  "phone",
  "query",
  "title",
  "username",
  "website",
  ...NON_ML_MAIN_LABELS,
] as const;
export type FieldMainLabelsType = (typeof FIELD_MAIN_LABELS)[number];
const ACTION_EXTRA_VALUES = [
  "change_password",
  "forgot_login",
  "forgot_password",
  "login",
  "logout",
  "my_account",
  "next",
  "register",
  "search",
  "subscribe",
] as const;
const CODE_EXTRA_VALUES = ["code"] as const;
const COMPANY_EXTRA_VALUES = ["company_name"] as const;
const CONSENT_EXTRA_VALUES = [
  "newsletter",
  "privacy_policy",
  "rememberme",
  "terms",
] as const;
const DATE_EXTRA_VALUES = [
  "birth",
  "day",
  "expiration",
  "issue",
  "month",
  "year",
] as const;
const EMAIL_EXTRA_VALUES = ["local_part", "domain_part"] as const;
const ID_EXTRA_VALUES = [
  "citizenship",
  "drivers_license",
  "id_card",
  "passport",
  "ssn",
  "tax",
] as const;
const LOCATION_EXTRA_VALUES = [
  "address_name",
  "birth",
  "box",
  "building",
  "city",
  "country",
  "department",
  "door",
  "floor",
  "region",
  "stairway",
  "street",
  "street_number",
  "street_type",
  "zip",
] as const;
const LOCATION_TYPE_EXTRA_VALUES = ["billing", "shipping"] as const;
const NAME_EXTRA_VALUES = [
  "first",
  "last",
  "maiden",
  "middle",
  "middle_initials",
] as const;
const PARTIAL_EXTRA_VALUES = ["part", "extra"] as const;
const PAYMENT_EXTRA_VALUES = [
  "bank_account",
  "bank_code",
  "bank_name",
  "bic",
  "credit_card",
  "cvv",
  "iban",
  "number",
  "swift",
  "type",
] as const;
const PHONE_EXTRA_VALUES = [
  "country",
  "mobile",
  "prefix",
  "type",
  "suffix",
] as const;
const REPETITION_EXTRA_VALUES = ["confirmation", "new", "secondary"] as const;
const TITLE_EXTRA_VALUES = ["job", "gender"] as const;
export const FIELD_EXTRA_VALUES = {
  action: ACTION_EXTRA_VALUES,
  address: [
    ...LOCATION_EXTRA_VALUES,
    ...CODE_EXTRA_VALUES,
    ...ID_EXTRA_VALUES,
    ...PAYMENT_EXTRA_VALUES,
    ...LOCATION_TYPE_EXTRA_VALUES,
    ...PARTIAL_EXTRA_VALUES,
  ] as const,
  age: [] as const,
  captcha: [] as const,
  company: [
    ...COMPANY_EXTRA_VALUES,
    ...TITLE_EXTRA_VALUES,
    ...PARTIAL_EXTRA_VALUES,
  ] as const,
  consent: CONSENT_EXTRA_VALUES,
  date: [
    ...DATE_EXTRA_VALUES,
    ...ID_EXTRA_VALUES,
    ...PAYMENT_EXTRA_VALUES,
  ] as const,
  email: [...REPETITION_EXTRA_VALUES, ...EMAIL_EXTRA_VALUES] as const,
  name: [
    ...NAME_EXTRA_VALUES,
    ...ID_EXTRA_VALUES,
    ...TITLE_EXTRA_VALUES,
    ...PAYMENT_EXTRA_VALUES,
    ...LOCATION_TYPE_EXTRA_VALUES,
    ...PARTIAL_EXTRA_VALUES,
  ] as const,
  id_document: [...ID_EXTRA_VALUES, ...PARTIAL_EXTRA_VALUES] as const,
  other: [] as const,
  otp: PARTIAL_EXTRA_VALUES,
  password: [...REPETITION_EXTRA_VALUES, ...PARTIAL_EXTRA_VALUES] as const,
  payment: [
    ...PAYMENT_EXTRA_VALUES,
    ...LOCATION_TYPE_EXTRA_VALUES,
    ...PARTIAL_EXTRA_VALUES,
    ...DATE_EXTRA_VALUES,
  ] as const,
  phone: [...PHONE_EXTRA_VALUES, ...PARTIAL_EXTRA_VALUES] as const,
  query: [] as const,
  username: [...REPETITION_EXTRA_VALUES, ...PARTIAL_EXTRA_VALUES] as const,
  title: TITLE_EXTRA_VALUES,
  website: PARTIAL_EXTRA_VALUES,
  webauthn: [] as const,
};
export type SomeFieldExtraLabel<L extends FieldMainLabelsType> =
  (typeof FIELD_EXTRA_VALUES)[L][number];
export type FieldExtraLabelsType = SomeFieldExtraLabel<FieldMainLabelsType>;
export type FieldLabel<L extends FieldMainLabelsType> = {
  main: L;
  extra: SomeFieldExtraLabel<L>[];
};
export type ExtraValuesAndDataSource<L extends FieldMainLabelsType> = {
  extraValues: SomeFieldExtraLabel<L>[];
  source: AutofillDataSourceRef;
};
export type FieldLabelToDataSource = {
  [L in keyof typeof FIELD_EXTRA_VALUES]: Record<
    L,
    ExtraValuesAndDataSource<L>[]
  >;
}[keyof typeof FIELD_EXTRA_VALUES];
