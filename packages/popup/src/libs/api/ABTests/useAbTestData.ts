import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../carbonConnector";
import { DataStatus } from "../types";
export function useABTestData(key: string) {
  const ABTestResult = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getUserABTestVariant,
        queryParam: key,
      },
    },
    [key]
  );
  if (ABTestResult.status === DataStatus.Success) {
    if (ABTestResult.data === "controlGroup") {
      void carbonConnector.participateToUserABTest(key);
      return { ...ABTestResult, data: true };
    }
    if (ABTestResult.data === "A") {
      void carbonConnector.participateToUserABTest(key);
      return { ...ABTestResult, data: true };
    }
    return { ...ABTestResult, data: false };
  }
  return ABTestResult;
}
