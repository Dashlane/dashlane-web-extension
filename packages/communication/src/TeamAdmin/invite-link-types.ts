import { UnknownTeamAdminError } from "./errors";
export type InviteLinkResponseSuccess<T> = {
  success: true;
  data: T;
};
export enum InviteLinkResponseErrorCode {
  NotAdmin = "not_admin",
  TeamKeyNotFound = "TEAM_KEY_NOT_FOUND",
  InviteLinkNotFound = "TEAM_INVITE_LINK_NOT_FOUND",
  UserInviteLinkNotFound = "USER_TEAM_INVITE_TOKEN_NOT_FOUND",
}
export type InviteLinkResponseFailure = {
  success: false;
  error: {
    code: InviteLinkResponseErrorCode | typeof UnknownTeamAdminError;
  };
};
export type CreateInviteLinkRequest = {
  displayName: string;
};
export type CreateInviteLinkSuccessData = {
  teamKey: string;
  displayName: string;
  extra: string;
  disabled: boolean;
};
export type CreateInviteLinkResult =
  | InviteLinkResponseSuccess<CreateInviteLinkSuccessData>
  | InviteLinkResponseFailure;
export type RequestInviteLinkTokenRequest = {
  teamUuid: string;
  login: string;
};
export type RequestInviteLinkTokenSuccessData = {};
export type RequestInviteLinkTokenResult =
  | InviteLinkResponseSuccess<RequestInviteLinkTokenSuccessData>
  | InviteLinkResponseFailure;
export type GetInviteLinkRequest = {
  teamKey: string;
};
export type GetInviteLinkSuccessData = {
  teamKey: string;
  teamUuid: string;
  displayName: string;
  disabled: boolean;
};
export type GetInviteLinkResult =
  | InviteLinkResponseSuccess<GetInviteLinkSuccessData>
  | InviteLinkResponseFailure;
export type GetInviteLinkForAdminRequest = Record<never, never>;
export type GetInviteLinkForAdminSuccessData = {
  teamKey: string;
  displayName: string;
  creationDateUnix: number;
  updateDateUnix: number;
  disabled: boolean;
};
export type GetInviteLinkForAdminResult =
  | InviteLinkResponseSuccess<GetInviteLinkForAdminSuccessData>
  | InviteLinkResponseFailure;
export type ChangeInviteLinkTeamKeyRequest = Record<never, never>;
export type ChangeInviteLinkTeamKeySuccessData = {
  teamKey: string;
};
export type ChangeInviteLinkTeamKeyResult =
  | InviteLinkResponseSuccess<ChangeInviteLinkTeamKeySuccessData>
  | InviteLinkResponseFailure;
export type ToggleInviteLinkRequest = {
  disabled: boolean;
};
export type ToggleInviteLinkSuccessData = {
  teamKey: string;
  disabled: boolean;
};
export type ToggleInviteLinkResult =
  | InviteLinkResponseSuccess<ToggleInviteLinkSuccessData>
  | InviteLinkResponseFailure;
