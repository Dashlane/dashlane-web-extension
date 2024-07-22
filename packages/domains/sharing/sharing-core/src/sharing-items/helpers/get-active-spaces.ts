import { PremiumStatus, PremiumStatusSpace } from "@dashlane/communication";
export const getActiveSpaces = (
  premiumStatus: PremiumStatus
): PremiumStatusSpace[] => {
  const spaces = premiumStatus.spaces ?? [];
  return spaces.filter((space) => space.status === "accepted");
};
