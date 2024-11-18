import { EventLoggerState } from "./state";
import {
  CREATE_EVENT_LOGGER_VIRTUAL_STORE,
  EventLoggerAction,
  UPDATE_EVENT_LOGGER_STATE,
} from "./actions";
function getEmptyEventLoggerState() {
  return {};
}
export const eventLoggerReducer = (
  state: EventLoggerState = getEmptyEventLoggerState(),
  action: EventLoggerAction
): EventLoggerState => {
  switch (action.type) {
    case CREATE_EVENT_LOGGER_VIRTUAL_STORE:
      return {
        [action.storeName]: action.initialState,
      };
    case UPDATE_EVENT_LOGGER_STATE:
      return {
        [action.storeName]: action.updater(state[action.storeName]),
      };
    default:
      return state;
  }
};
