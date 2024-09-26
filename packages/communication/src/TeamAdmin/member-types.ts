export declare type GetRecoveryCodesAsTeamCaptainSuccess = {
  success: true;
  data: {
    recoveryCodes: string[];
  };
};
export type GetRecoveryCodesAsTeamCaptainFailure = {
  success: false;
  error: {
    code: GetRecoveryCodesAsTeamCaptainErrorCode;
  };
};
export enum GetRecoveryCodesAsTeamCaptainErrorCode {
  NotAdmin = "not_billing_admin",
  InternalError = "internal_error",
  UnknownError = "UNKNOWN_ERROR",
}
export type GetRecoveryCodesAsTeamCaptainResult =
  | GetRecoveryCodesAsTeamCaptainSuccess
  | GetRecoveryCodesAsTeamCaptainFailure;
export type GetRecoveryCodesAsTeamCaptainRequest = {
  login: string;
};
