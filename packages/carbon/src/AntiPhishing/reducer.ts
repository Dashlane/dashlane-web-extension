import { areSetsEqual } from "Helpers/sets-utils";
import { AntiPhishingAction, UPDATE_ANTI_PHISHING_URL_LIST } from "./actions";
import { AntiPhishingState } from "./types";
export const getEmptyAntiPhishingState = () => new Set([]);
export const AntiPhishingReducer = (
  state: AntiPhishingState = getEmptyAntiPhishingState(),
  action: AntiPhishingAction
): AntiPhishingState => {
  switch (action.type) {
    case UPDATE_ANTI_PHISHING_URL_LIST:
      return areSetsEqual(action.phishingURLList, state)
        ? state
        : action.phishingURLList;
    default:
      return state;
  }
};
