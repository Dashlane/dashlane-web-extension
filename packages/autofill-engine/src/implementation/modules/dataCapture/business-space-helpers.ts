import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { WebcardSpacesData } from "../../../Api/types/webcards/webcard-data-base";
const checkLoginOrDomainForceCategorization = (
  spaces: PremiumStatusSpaceItemView[],
  login: string,
  fullDomain: string
): {
  forceCategorizationEnabled: boolean;
  forcedSpace?: string;
} => {
  const spaceTriggeringForceCat = spaces.find(
    (space) =>
      space.settings.enableForcedCategorization &&
      space.settings.spaceForcedDomains.some((forcedDomain) => {
        const containsTeamDomain = (str: string) =>
          forcedDomain !== "" && str && str.includes(forcedDomain);
        return containsTeamDomain(fullDomain) || containsTeamDomain(login);
      })
  );
  return {
    forceCategorizationEnabled: spaceTriggeringForceCat !== undefined,
    forcedSpace: spaceTriggeringForceCat?.spaceId,
  };
};
const MAX_DISPLAY_LENGTH = 18;
const formatBusinessSpaceDisplayName = (displayName: string) =>
  displayName.length <= MAX_DISPLAY_LENGTH
    ? displayName
    : `${displayName.slice(0, MAX_DISPLAY_LENGTH)}...`;
export interface SavePasswordBusinessSpaceData {
  readonly showSpacesList: boolean;
  readonly spaces: WebcardSpacesData[];
  readonly defaultSpace: string;
}
export const getSavePasswordBusinessSpaceData = (
  spaces: PremiumStatusSpaceItemView[],
  login: string,
  fullDomain: string
): SavePasswordBusinessSpaceData => {
  const { forceCategorizationEnabled, forcedSpace } =
    checkLoginOrDomainForceCategorization(spaces, login, fullDomain);
  return {
    spaces: spaces.map(({ letter, color, spaceId, displayName }) => ({
      letter,
      color,
      spaceId,
      displayName: formatBusinessSpaceDisplayName(displayName),
    })),
    showSpacesList: spaces.length > 1 && !forceCategorizationEnabled,
    defaultSpace: forcedSpace ?? "",
  };
};
