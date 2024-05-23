import { PremiumStatusCode } from '@dashlane/communication';
const STRICT_PREMIUM_STATUSES = [
    PremiumStatusCode.PREMIUM,
    PremiumStatusCode.PREMIUM_CANCELLED,
];
const hasStatus = (statuses: PremiumStatusCode[]) => (premiumStatusCode: PremiumStatusCode | undefined): boolean => premiumStatusCode === undefined
    ? false
    : statuses.includes(premiumStatusCode);
export const isLegacyStatus = hasStatus([PremiumStatusCode.OLD_ACCOUNT]);
export const isFreeStatus = hasStatus([PremiumStatusCode.NO_PREMIUM]);
export const isFreePremiumStatus = hasStatus([PremiumStatusCode.NEW_USER]);
export const isStrictPremiumStatus = hasStatus(STRICT_PREMIUM_STATUSES);
export const isPremiumStatus = hasStatus([
    ...STRICT_PREMIUM_STATUSES,
    PremiumStatusCode.NEW_USER,
    PremiumStatusCode.OLD_ACCOUNT,
]);
export const isCancelledPremiumStatus = hasStatus([
    PremiumStatusCode.PREMIUM_CANCELLED,
]);
