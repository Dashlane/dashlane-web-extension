export interface ContactInfo {
  email?: string;
  phone?: string;
  language?: string;
  country?: string;
  oslanguage?: string;
  oscountry?: string;
}
export enum EditContactInfoErrorCode {
  EMPTY_EMAIL,
  INVALID_EMAIL,
  UNKNOWN_ERROR,
}
type EditContactInfoResultSuccess = {
  success: true;
};
type EditContactInfoResultError = {
  success: false;
  error: {
    code: EditContactInfoErrorCode;
  };
};
export type EditContactInfoClientRequest = {
  contactEmail?: string;
  contactPhone?: string;
  country?: string;
  osCountry?: string;
  language?: string;
  osLanguage?: string;
};
export type EditContactInfoClientResult =
  | EditContactInfoResultSuccess
  | EditContactInfoResultError;
export enum RefreshContactInfoErrorCode {
  UNKNOWN_ERROR,
}
type RefreshContactInfoResultSuccess = {
  success: true;
};
type RefreshContactInfoResultError = {
  success: false;
  error: {
    code: RefreshContactInfoErrorCode;
  };
};
export type RefreshContactInfoResult =
  | RefreshContactInfoResultSuccess
  | RefreshContactInfoResultError;
