import { ValuesType } from "@dashlane/framework-types";
import {
  AlreadyJoinedThisFamily,
  BadLogin,
  CannotJoinMultipleFamilies,
  CannotRemoveFamilyAdmin,
  FamilyFull,
  FamilyHasBeenDiscontinued,
  JoinFamilyTokenNotFound,
  UnknownFamilyError,
  UserMustBeFamilyAdmin,
  UserMustCancelPremiumPlusRenewalToDowngradeToFamily,
  UserNotMemberOfFamily,
  UserSubscriptionIsUpForRenewal,
} from "./errors";
type UnknownFamilyErrorType = typeof UnknownFamilyError;
type Error =
  | typeof BadLogin
  | typeof FamilyFull
  | typeof CannotJoinMultipleFamilies
  | typeof AlreadyJoinedThisFamily
  | typeof JoinFamilyTokenNotFound
  | typeof UserSubscriptionIsUpForRenewal
  | typeof FamilyHasBeenDiscontinued
  | typeof UserMustCancelPremiumPlusRenewalToDowngradeToFamily;
export type JoinFamilyError = Error | UnknownFamilyErrorType;
export type LeaveFamilyError =
  | typeof UserNotMemberOfFamily
  | typeof CannotRemoveFamilyAdmin
  | UnknownFamilyErrorType;
export type GetFamilyDetailsError =
  | typeof UserMustBeFamilyAdmin
  | UnknownFamilyErrorType;
export type RemoveFamilyMemberError =
  | typeof UserMustBeFamilyAdmin
  | typeof CannotRemoveFamilyAdmin
  | typeof UserNotMemberOfFamily
  | UnknownFamilyErrorType;
export type ResetFamilyJoinTokenError =
  | typeof UserMustBeFamilyAdmin
  | UnknownFamilyErrorType;
export enum JoinFamilyUserStatus {
  NEW_USER = "NEW_USER",
  EXISTING_FREE_USER = "EXISTING_FREE_USER",
  EXISTING_PREMIUM_USER = "EXISTING_PREMIUM_USER",
}
export enum FamilyStatusCode {
  DISCONTINUED = 0,
  PREMIUM = 1,
  PREMIUM_PLUS = 2,
}
export const FamilyMemberRoles = Object.freeze({
  ADMIN: "admin",
  REGULAR: "regular",
  REMOVED: "removed",
});
export type FamilyMemberRole = ValuesType<typeof FamilyMemberRoles>;
export type FamilyMember = {
  userId: number;
  login: string;
  role: FamilyMemberRole;
};
export enum FamilyRenewalPlatform {
  IOS_APP_STORE = "ios",
  MAC_STORE = "mac",
  PLAY_STORE = "playstore",
}
type ShowRenewalInformation = {
  showRenewalMessage: true;
  platform: FamilyRenewalPlatform;
};
type HideRenewalInformation = {
  showRenewalMessage: false;
};
export type FamilyRenewalInformation =
  | ShowRenewalInformation
  | HideRenewalInformation;
export interface JoinFamilyRequest {
  login: string;
  joinToken: string;
}
export type JoinFamilyResultSuccess = {
  success: true;
  response: {
    name: string;
    userExists: boolean;
    userStatus: JoinFamilyUserStatus;
    renewalInformation: FamilyRenewalInformation;
  };
};
export type JoinFamilyResultFailure = {
  success: false;
  error: {
    code: JoinFamilyError;
  };
};
export type JoinFamilyResult =
  | JoinFamilyResultSuccess
  | JoinFamilyResultFailure;
export type GetFamilyDetailsSuccess = {
  success: true;
  response: {
    name: string;
    id: number;
    joinToken: string;
    statusCode: FamilyStatusCode;
    members: {
      admin: FamilyMember;
      regular: FamilyMember[];
      removed: FamilyMember[];
    };
    spots: number;
  };
};
export type GetFamilyDetailsFailure = {
  success: false;
  error: {
    code: GetFamilyDetailsError;
  };
};
export type GetFamilyDetailsResult =
  | GetFamilyDetailsSuccess
  | GetFamilyDetailsFailure;
export interface RemoveFamilyMemberRequest {
  userId: number;
}
export type RemoveFamilyMemberSuccess = {
  success: true;
  response: {};
};
export type RemoveFamilyMemberFailure = {
  success: false;
  error: {
    code: RemoveFamilyMemberError;
  };
};
export type RemoveFamilyMemberResult =
  | RemoveFamilyMemberSuccess
  | RemoveFamilyMemberFailure;
export type ResetFamilyJoinTokenSuccess = {
  success: true;
  response: {
    joinToken: string;
  };
};
export type ResetFamilyJoinTokenFailure = {
  success: false;
  error: {
    code: ResetFamilyJoinTokenError;
  };
};
export type ResetFamilyJoinTokenResult =
  | ResetFamilyJoinTokenSuccess
  | ResetFamilyJoinTokenFailure;
export type LeaveFamilyResultSuccess = {
  success: true;
  response: {};
};
export type LeaveFamilyResultFailure = {
  success: false;
  error: {
    code: LeaveFamilyError;
  };
};
export type LeaveFamilyResult =
  | LeaveFamilyResultSuccess
  | LeaveFamilyResultFailure;
