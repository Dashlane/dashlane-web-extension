import {
  SessionABTestAction,
  STORED_USER_AB_TEST_LOADED,
  USER_AB_TESTS_UPDATED,
} from "Session/Store/abTests/actions";
import { UserABTests } from "Session/Store/abTests/types";
export function getEmptyTests(): UserABTests {
  return {
    lastUpdateTimestamp: null,
    tests: {},
  };
}
export default (state = getEmptyTests(), action: SessionABTestAction) => {
  switch (action.type) {
    case USER_AB_TESTS_UPDATED:
      return {
        ...state,
        tests: action.tests,
        lastUpdateTimestamp: action.lastUpdateTimestamp,
      };
    case STORED_USER_AB_TEST_LOADED:
      return { ...state, ...action.userABTests };
    default:
      return state;
  }
};
