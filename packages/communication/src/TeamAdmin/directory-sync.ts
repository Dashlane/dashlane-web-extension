import { InsufficientTier, NotAdmin, UnknownTeamAdminError } from "./errors";
export interface LastADSyncDateSuccess {
  lastSyncRequestForTeam: number;
  lastSuccessfulSyncRequestForTeam: number;
}
export type LastADSyncDateError =
  | typeof NotAdmin
  | typeof InsufficientTier
  | typeof UnknownTeamAdminError;
export interface GetLastADSyncDateResultSuccess {
  success: true;
  data: LastADSyncDateSuccess;
}
export interface GetLastADSyncDateResultFailure {
  success: false;
  error: {
    code: LastADSyncDateError;
  };
}
export type GetLastADSyncDateResult =
  | GetLastADSyncDateResultSuccess
  | GetLastADSyncDateResultFailure;
