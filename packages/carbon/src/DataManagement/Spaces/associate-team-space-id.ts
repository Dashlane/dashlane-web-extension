import {
  BaseDataModelObject,
  Credential,
  PremiumStatusSpace,
} from "@dashlane/communication";
import {
  isItemForceCategorizable,
  isTeamSpaceQuarantined,
  pickBestTeamSpaceForForcedCategorization,
} from "DataManagement/SmartTeamSpaces/forced-categorization.domain";
import { SpaceWithForceCategorization } from "DataManagement/SmartTeamSpaces/forced-categorization.domain-types";
const getSpacesWithForceCat = (
  spaces: PremiumStatusSpace[]
): SpaceWithForceCategorization["details"][] => {
  return spaces.filter(
    (space) =>
      space.info.forcedDomainsEnabled &&
      space.info.teamDomains.length &&
      !isTeamSpaceQuarantined(space)
  ) as SpaceWithForceCategorization["details"][];
};
export function associateTeamSpaceId<T extends BaseDataModelObject>(
  item: T,
  spaces: PremiumStatusSpace[],
  credentials?: Credential[]
): T {
  if (!isItemForceCategorizable(item) || !spaces || spaces.length === 0) {
    return item;
  }
  const spacesWithForceCat = getSpacesWithForceCat(spaces);
  if (!spacesWithForceCat.length) {
    return item;
  }
  const pick = pickBestTeamSpaceForForcedCategorization(
    spacesWithForceCat,
    item,
    credentials
  );
  return pick ? { ...item, SpaceId: pick.teamSpace.teamId } : item;
}
