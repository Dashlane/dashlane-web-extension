import {
  JoinFamilyUserStatus,
  PremiumStatusCode,
} from "@dashlane/communication";
export const getUserStatus = (
  statusCode: PremiumStatusCode,
  userExists: boolean
): JoinFamilyUserStatus => {
  switch (statusCode) {
    case PremiumStatusCode.NEW_USER: {
      return JoinFamilyUserStatus.NEW_USER;
    }
    case PremiumStatusCode.NO_PREMIUM: {
      return userExists
        ? JoinFamilyUserStatus.EXISTING_FREE_USER
        : JoinFamilyUserStatus.NEW_USER;
    }
    case PremiumStatusCode.OLD_ACCOUNT: {
      return JoinFamilyUserStatus.EXISTING_FREE_USER;
    }
    case PremiumStatusCode.PREMIUM:
    case PremiumStatusCode.PREMIUM_CANCELLED: {
      return JoinFamilyUserStatus.EXISTING_PREMIUM_USER;
    }
    default: {
      throw new Error(
        "Family getUserStatus: impossible to identify user status"
      );
    }
  }
};
