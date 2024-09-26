export declare type PersonalDataExportType = "secure-dashlane" | "csv";
export interface GetPersonalDataExportRequest {
  exportType: PersonalDataExportType;
  password?: string;
}
export type GetPersonalDataExportResult =
  | GetPersonalDataExportSuccess
  | GetPersonalDataExportError;
const DASH = "Dashlane Export.dash";
const CSV = "dashlane-credential-export.zip";
export type ExportedFileName = typeof DASH | typeof CSV;
type GetPersonalDataExportSuccess = {
  success: true;
  response: {
    filename: ExportedFileName;
    content: string;
  };
};
export enum GetPersonalDataExportErrorMessage {
  UNSUPPORTED_DATATYPE_ERROR = "Unsupported Data Export Type",
  UNDEFINED_PASSWORD_ERROR = "Undefined Password",
}
export type GetPersonalDataExportError = {
  success: false;
  error: {
    code: GetPersonalDataExportErrorMessage;
  };
};
