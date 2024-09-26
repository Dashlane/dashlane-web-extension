export interface PremiumStatusSpaceItemView {
  spaceId: string;
  letter: string;
  color: string;
  displayName: string;
  settings: {
    enableForcedCategorization: boolean;
    spaceForcedDomains: string[];
  };
  isSSOUser: boolean;
}
