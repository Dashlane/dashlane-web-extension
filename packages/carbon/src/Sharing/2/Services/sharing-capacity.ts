import { PremiumStatus, SharingCapacity } from "@dashlane/communication";
export const getSharingCapacity = (
  sharedItemsCount: number,
  premiumStatus: PremiumStatus
): SharingCapacity => {
  const maxSharedItemsCount =
    premiumStatus?.capabilities?.sharingLimit?.info?.limit ?? Infinity;
  if (maxSharedItemsCount === Infinity) {
    return {
      type: "unlimited",
    };
  }
  return {
    type: "limited",
    remains: Math.max(0, maxSharedItemsCount - sharedItemsCount),
  };
};
