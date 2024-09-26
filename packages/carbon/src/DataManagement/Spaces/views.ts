import {
  PremiumStatusSpace,
  PremiumStatusSpaceItemView,
} from "@dashlane/communication";
export const itemView = ({
  color,
  letter,
  info,
  teamId,
  isSSOUser,
}: PremiumStatusSpace): PremiumStatusSpaceItemView => {
  return {
    spaceId: teamId,
    displayName: info.name ?? "",
    color,
    letter,
    settings: {
      enableForcedCategorization: info.forcedDomainsEnabled,
      spaceForcedDomains: info.teamDomains,
    },
    isSSOUser,
  };
};
export const listView = (
  premiumStatusSpaces: PremiumStatusSpace[]
): PremiumStatusSpaceItemView[] => premiumStatusSpaces.map(itemView);
