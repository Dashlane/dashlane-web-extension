import { State } from "Store";
import { ABTest, UserABTests } from "Session/Store/abTests/types";
export const userABTestsSelector = (state: State): UserABTests =>
  state.userSession.abTests;
export const userABTestSelector = (state: State, testName: string): ABTest =>
  userABTestsSelector(state).tests[testName];
export const userABTestVariantSelector = (
  state: State,
  testName: string
): string | undefined => {
  const test = userABTestSelector(state, testName);
  return test ? test.variant : undefined;
};
