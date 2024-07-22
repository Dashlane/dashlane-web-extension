import { Matchable } from "@dashlane/framework-types";
export interface Request2FaCodesByPhoneCommandParams {
  email: string;
}
export enum Request2FaCodesByPhoneErrorCodes {
  AccountNotEligible = "AccountNotEligible",
  NetworkError = "NetworkError",
}
export type AccountNotEligible =
  Matchable<Request2FaCodesByPhoneErrorCodes.AccountNotEligible>;
export type NetworkError =
  Matchable<Request2FaCodesByPhoneErrorCodes.NetworkError>;
export type Request2FaCodesByPhoneErrors = AccountNotEligible | NetworkError;
