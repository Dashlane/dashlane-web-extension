import { NodePremiumStatus } from "@dashlane/communication";
export const isFullAdmin = (premiumStatus: NodePremiumStatus) => {
  return (
    (premiumStatus.spaces?.some((space) => space.status === "accepted") &&
      premiumStatus.spaces?.some((space) => space.isTeamAdmin)) ??
    false
  );
};
