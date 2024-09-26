import {
  JoinFamilyError,
  LeaveFamilyError,
  RemoveFamilyMemberError,
} from "Libs/DashlaneApi";
export const BadLogin = "BAD_LOGIN" as const;
export const FamilyFull = "FAMILY_FULL" as const;
export const CannotJoinMultipleFamilies =
  "CANNOT_JOIN_MULTIPLE_FAMILIES" as const;
export const AlreadyJoinedThisFamily = "ALREADY_JOINED_THIS_FAMILY" as const;
export const JoinFamilyTokenNotFound = "JOIN_FAMILY_TOKEN_NOT_FOUND" as const;
export const UserSubscriptionIsUpForRenewal =
  "USER_SUBSCRIPTION_IS_UP_FOR_RENEWAL" as const;
export const FamilyHasBeenDiscontinued =
  "FAMILY_HAS_BEEN_DISCONTINUED" as const;
export const UserMustBeFamilyAdmin = "USER_MUST_BE_FAMILY_ADMIN" as const;
export const CannotRemoveFamilyAdmin = "CANNOT_REMOVE_FAMILY_ADMIN" as const;
export const UserNotMemberOfFamily = "USER_NOT_MEMBER_OF_FAMILY" as const;
export const UserMustCancelPremiumPlusRenewalToDowngradeToFamily =
  "USER_MUST_CANCEL_PREMIUM_PLUS_RENEWAL_TO_DOWNGRADE_TO_FAMILY" as const;
export const joinFamilyErrors: JoinFamilyError[] = [
  BadLogin,
  FamilyFull,
  CannotJoinMultipleFamilies,
  AlreadyJoinedThisFamily,
  JoinFamilyTokenNotFound,
  UserSubscriptionIsUpForRenewal,
  FamilyHasBeenDiscontinued,
  UserMustCancelPremiumPlusRenewalToDowngradeToFamily,
];
export const leaveFamilyErrors: LeaveFamilyError[] = [
  CannotRemoveFamilyAdmin,
  UserNotMemberOfFamily,
];
export const removeFamilyMemberErrors: RemoveFamilyMemberError[] = [
  UserMustBeFamilyAdmin,
  CannotRemoveFamilyAdmin,
  UserNotMemberOfFamily,
];
