import { PremiumStatusSpace } from "@dashlane/communication";
export const isValidSpace = (space: unknown): space is PremiumStatusSpace => {
  if (!space) {
    return false;
  }
  const item = space as Partial<PremiumStatusSpace>;
  return (
    !!item.associatedEmail &&
    !!item.billingAdmins &&
    !!item.color &&
    !!item.info &&
    !!item.letter &&
    !!item.planType &&
    !!item.status &&
    !!item.teamAdmins &&
    !!item.teamId &&
    !!item.teamName &&
    !!item.tier
  );
};
export const isSpaceArray = (
  spaceArray: unknown
): spaceArray is PremiumStatusSpace[] => {
  if (!spaceArray || !Array.isArray(spaceArray)) {
    return false;
  }
  if (spaceArray.length === 0) {
    return false;
  }
  const activeSpace = spaceArray.find((space) => space.status === "accepted");
  return isValidSpace(activeSpace);
};
