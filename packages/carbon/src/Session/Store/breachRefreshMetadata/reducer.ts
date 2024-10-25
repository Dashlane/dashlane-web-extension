import { BreachRefreshMetaData } from "./types";
import { UPDATE_BREACHES_REFRESH_TIMESTAMP } from "./actions";
export const getEmptyBreachRefreshMetadata = (): BreachRefreshMetaData => ({
  lastBreachRefreshTimestamp: 0,
});
export const breachRefreshMetaDataReducer = (
  state = getEmptyBreachRefreshMetadata(),
  action: any
): BreachRefreshMetaData => {
  switch (action.type) {
    case UPDATE_BREACHES_REFRESH_TIMESTAMP:
      return {
        lastBreachRefreshTimestamp: action.lastBreachRefreshTimestamp,
      };
    default:
      return state;
  }
};
