import {
  LAST_SENT_AT_UPDATED,
  UserActivityAction,
  UserActivityState,
} from "Session/Store/userActivity/types";
export default (
  state = getEmptyUserActivityState(),
  action: UserActivityAction
): UserActivityState => {
  switch (action.type) {
    case LAST_SENT_AT_UPDATED:
      return {
        ...state,
        lastSentAt: action.lastSentAt,
      };
    default:
      return state;
  }
};
export function getEmptyUserActivityState(): UserActivityState {
  return {
    lastSentAt: undefined,
  };
}
