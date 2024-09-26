import { createSelector } from "reselect";
import { Space } from "@dashlane/communication";
import { State } from "Store";
import { spacesSelector } from "DataManagement/Spaces/selectors";
import { ForceCategorizableKWTypes } from "DataManagement/SmartTeamSpaces/forced-categorization.domain";
import {
  ForceCategorizable,
  SpaceWithForceCategorization,
} from "DataManagement/SmartTeamSpaces/forced-categorization.domain-types";
import { isQuarantined } from "DataManagement/Spaces/is-quarantined";
import { personalDataItemsOfTypeSelector } from "DataManagement/PersonalData/selectors";
export const spacesWithForcedCategorizationEnabledSelector = (state: State) =>
  (state.userSession?.spaceData?.spaces || []).filter(
    (s) =>
      s?.details?.info &&
      Array.isArray(s.details.info.teamDomains) &&
      s.details.info.teamDomains.length > 0 &&
      Boolean(s.details.info.forcedDomainsEnabled)
  ) as SpaceWithForceCategorization[];
export const forceCategorizableItemsSelector = (state: State) =>
  personalDataItemsOfTypeSelector(
    state,
    ForceCategorizableKWTypes
  ) as ForceCategorizable[];
export const quarantinedSpacesSelector = createSelector(
  [spacesSelector],
  (spaces: Space[]) => spaces.filter(isQuarantined)
);
