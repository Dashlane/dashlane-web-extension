import { SpaceData } from "Session/Store/spaceData/types";
export { SpaceData } from "./types";
import {
  SPACE_DATA_UPDATED,
  SpaceDataUpdatedAction,
  SPACES_UPDATED,
  SpacesUpdatedAction,
} from "Session/Store/spaceData/actions";
import { Action } from "Store";
export default (
  state = getEmptySpaceDataState(),
  action: Action
): SpaceData => {
  switch (action.type) {
    case SPACES_UPDATED:
      const spacesUpdatedAction = action as SpacesUpdatedAction;
      return {
        ...state,
        ...{
          spaces: (spacesUpdatedAction.spaces || []).map((space) => ({
            teamId: space.teamId,
            details: space,
          })),
        },
      };
    case SPACE_DATA_UPDATED:
      const spaceDataUpdatedAction = action as SpaceDataUpdatedAction;
      return { ...spaceDataUpdatedAction.spaceData };
    default:
      return state;
  }
};
export function getEmptySpaceDataState(): SpaceData {
  return {
    spaces: [],
  };
}
