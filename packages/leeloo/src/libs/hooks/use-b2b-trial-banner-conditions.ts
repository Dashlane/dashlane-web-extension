import { AdminAccess } from "../../user/permissions";
export const useB2BTrialBannerConditions = (
  adminAccess: AdminAccess
): boolean => {
  return adminAccess.hasBillingAccess || adminAccess.hasFullAccess;
};
