import {
  BankAccount,
  BaseDataModelObject,
  Collection,
  Credential,
  Note,
  PaymentCard,
} from "../../DataModel";
export enum SupportedVaultTypes {
  CREDENTIAL = "credentials",
  NOTE = "notes",
  PAYMENT_CARD = "paymentCards",
  BANK_ACCOUNT = "bankAccounts",
  COLLECTION = "collections",
}
export type SupportedVaultItems = {
  [SupportedVaultTypes.CREDENTIAL]: Credential;
  [SupportedVaultTypes.NOTE]: Note;
  [SupportedVaultTypes.PAYMENT_CARD]: PaymentCard;
  [SupportedVaultTypes.BANK_ACCOUNT]: BankAccount;
  [SupportedVaultTypes.COLLECTION]: Collection;
};
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type SupportedVaultItemKeys = KeysOfUnion<
  SupportedVaultItems[keyof SupportedVaultItems]
>;
export type DataToImport = {
  [K in keyof SupportedVaultItems]: Array<{
    baseDataModel: Omit<SupportedVaultItems[K], "kwType"> &
      Partial<SupportedVaultItems[K]>;
    rawData: Record<string, string>;
  }>;
};
export type ParsedCSVData = {
  headers: {
    original: string;
    matched: string;
  }[];
  items: Array<
    | DataToImport[keyof DataToImport][number]
    | {
        baseDataModel: BaseDataModelObject;
        rawData: Record<string, string>;
      }
  >;
};
export interface ImportPersonalDataItemsResponse {
  totalCount: number;
  successCount: number;
  duplicateCount: number;
}
export enum ImportSource {
  "1Password" = "1password",
  "Bitwarden" = "bitwarden",
  "Chrome" = "chrome",
  "Dash" = "dash",
  "Edge" = "edge",
  "Firefox" = "firefox",
  "Keepass" = "keepass",
  "Keeper" = "keeper",
  "Lastpass" = "lastpass",
  "Other" = "other",
  "Safari" = "safari",
}
export enum ImportFormats {
  Csv = "csv",
  Dash = "dash",
}
export type ParsedData = BaseDataModelObject[];
export interface ImportPersonalDataRequest {
  format: ImportFormats;
  name: string;
  content: ParsedData;
}
export interface ImportPersonalDataStartingSuccess {
  success: true;
}
export enum ImportPersonalDataErrorType {
  Unavailable = "unavailable",
  Unknown = "unknown",
}
export interface ImportPersonalDataError {
  success: false;
  error: ImportPersonalDataErrorType;
}
export type ImportPersonalDataResult =
  | ImportPersonalDataError
  | ImportPersonalDataStartingSuccess;
export enum ImportPersonalDataStateType {
  Idle = "idle",
  Processing = "processing",
  Success = "success",
  Error = "error",
}
export interface ImportPersonalDataStateIdle {
  status: ImportPersonalDataStateType.Idle;
}
export interface ImportPersonalDataStateProcessing {
  status: ImportPersonalDataStateType.Processing;
  name: string;
}
export interface ImportPersonalDataStateSuccess
  extends ImportPersonalDataItemsResponse {
  status: ImportPersonalDataStateType.Success;
  name: string;
}
export interface ImportPersonalDataStateError {
  status: ImportPersonalDataStateType.Error;
  name: string;
}
export type ImportPersonalDataState =
  | ImportPersonalDataStateIdle
  | ImportPersonalDataStateProcessing
  | ImportPersonalDataStateSuccess
  | ImportPersonalDataStateError;
interface CommonPreviewRequest {
  name: string;
  content: {
    data: string;
    importSource: ImportSource;
  };
}
export enum PreviewPersonalDataErrorType {
  BadPassword = "bad_password",
  Unavailable = "unavailable",
  InvalidFormat = "invalid",
  Unknown = "unknown",
}
export interface PreviewCSVRequest extends CommonPreviewRequest {
  format: ImportFormats.Csv;
}
export interface PreviewDashRequest extends CommonPreviewRequest {
  format: ImportFormats.Dash;
  password: string;
}
export type PreviewPersonalDataRequest = PreviewCSVRequest | PreviewDashRequest;
export type PreviewPersonalDataResult =
  | {
      success: true;
      data: ParsedCSVData;
    }
  | {
      success: false;
      error: PreviewPersonalDataErrorType;
    };
