import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { VaultAutofillViewInterfaces } from "@dashlane/autofill-contracts";
import { WebcardSpacesData } from "../../../types";
export type GetFormattedWebcardItemArguments<
  T extends keyof VaultAutofillViewInterfaces
> = {
  vaultType: T;
  vaultItem: VaultAutofillViewInterfaces[T];
  premiumStatusSpace?: PremiumStatusSpaceItemView;
};
export const convertSpaceInfoForWebcard = (
  premiumStatusSpace?: PremiumStatusSpaceItemView
): WebcardSpacesData | undefined => {
  if (!premiumStatusSpace) {
    return undefined;
  }
  const { color, letter, spaceId, displayName } = premiumStatusSpace;
  return {
    color,
    letter,
    spaceId,
    displayName,
  };
};
