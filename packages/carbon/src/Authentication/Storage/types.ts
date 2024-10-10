export interface LoadUserAuthenticationDataSucceeded {
  type: "success";
}
export const FailedToReadParseOrValidateAuthenticationData =
  "Failed to read, parse or validate persisted data";
export const FailedToRehydrateAuthenticationData = "Failed to rehydrate";
export type LoadUserAuthenticationDataErrors =
  | typeof FailedToReadParseOrValidateAuthenticationData
  | typeof FailedToRehydrateAuthenticationData;
export interface LoadUserAuthenticationDataFailed {
  type: "failed";
  message: LoadUserAuthenticationDataErrors;
  error: any;
}
export type LoadUserAuthenticationDataResult =
  | LoadUserAuthenticationDataSucceeded
  | LoadUserAuthenticationDataFailed;
export const isLoadAuthenticationSuccess = (
  value: LoadUserAuthenticationDataResult
): value is LoadUserAuthenticationDataSucceeded =>
  typeof value === "object" && value.type === "success";
