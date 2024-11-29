import { ABTest as ServerABTest } from "Libs/DashlaneApi/services/abtesting/types";
import { ABTests } from "Session/Store/abTests/types";
export const NOT_PARTICIPATING = "not-participating";
export function mapGetUserABServerResponse(
  abTestNames: string[],
  receivedABTests: ServerABTest[]
): ABTests {
  const mappedABTests = abTestNames.reduce((memo: ABTests, testName) => {
    const test = receivedABTests.find((abTest) => testName === abTest.name);
    memo[testName] = test
      ? {
          variant: test.variant,
          version: test.abtestVersion,
        }
      : {
          variant: NOT_PARTICIPATING,
        };
    return memo;
  }, {});
  return mappedABTests;
}
