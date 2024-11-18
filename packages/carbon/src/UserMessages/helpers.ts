import {
  PremiumStatus,
  PremiumStatusCode,
  TrialExpiredUserMessage,
  UserMessageTypes,
} from "@dashlane/communication";
interface IsTrialExpiredParams {
  premiumStatus: PremiumStatus;
  currentDate?: number;
}
export function isTrialExpired({
  premiumStatus,
  currentDate = Date.now(),
}: IsTrialExpiredParams): boolean {
  switch (premiumStatus?.statusCode) {
    case PremiumStatusCode.PREMIUM:
    case PremiumStatusCode.OLD_ACCOUNT:
    case PremiumStatusCode.NEW_USER:
    case PremiumStatusCode.GRACE_PERIOD:
      return false;
    case PremiumStatusCode.PREMIUM_CANCELLED: {
      const endDateUnixMs = (premiumStatus.endDate ?? 0) * 1000;
      return endDateUnixMs ? endDateUnixMs - currentDate < 0 : false;
    }
    case PremiumStatusCode.NO_PREMIUM:
    default:
      return true;
  }
}
export function createTrialExpiredUserMessage(): TrialExpiredUserMessage {
  return {
    type: UserMessageTypes.TRIAL_EXPIRED,
  };
}
