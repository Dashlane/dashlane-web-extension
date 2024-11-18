import { PremiumStatusSpace } from "@dashlane/communication";
import { Action } from "Store";
import { SpaceData } from "Session/Store/spaceData/types";
export const SPACES_UPDATED = "SPACES_UPDATED";
export const SPACE_DATA_UPDATED = "SPACE_DATA_UPDATED";
export interface SpacesUpdatedAction extends Action {
  spaces: PremiumStatusSpace[];
}
export const spacesUpdated = (
  spaces: PremiumStatusSpace[]
): SpacesUpdatedAction => ({
  type: SPACES_UPDATED,
  spaces,
});
export interface SpaceDataUpdatedAction extends Action {
  spaceData: SpaceData;
}
export const spaceDataUpdated = (
  spaceData: SpaceData
): SpaceDataUpdatedAction => ({
  type: SPACE_DATA_UPDATED,
  spaceData,
});
