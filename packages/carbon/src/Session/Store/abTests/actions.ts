import { ABTests, UserABTests } from "Session/Store/abTests/types";
import { Action } from "Store";
export const USER_AB_TESTS_UPDATED = "USER_AB_TEST_UPDATED";
export const STORED_USER_AB_TEST_LOADED = "STORED_USER_AB_TEST_LOADED";
export const SENT_AB_TEST_USAGE_LOG = "SENT_AB_TEST_USAGE_LOG";
type ActionType =
  | typeof USER_AB_TESTS_UPDATED
  | typeof STORED_USER_AB_TEST_LOADED;
interface RefreshedABTestAction extends Action {
  type: ActionType;
  tests: Partial<ABTests>;
  lastUpdateTimestamp: number;
}
export const refreshedUserABTests = (
  userABTests: ABTests
): RefreshedABTestAction => ({
  type: USER_AB_TESTS_UPDATED,
  lastUpdateTimestamp: Date.now(),
  tests: userABTests,
});
interface LoadedStoredUserABTestAction extends Action {
  type: ActionType;
  userABTests: UserABTests;
}
export const loadedStoredUserABTests = (
  userABTests: UserABTests
): LoadedStoredUserABTestAction => ({
  type: STORED_USER_AB_TEST_LOADED,
  userABTests,
});
export type SessionABTestAction =
  | RefreshedABTestAction
  | LoadedStoredUserABTestAction;
