import { useMemo } from "react";
import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../carbon/connector";
export function useGetABTest(
  testName: string
): CarbonEndpointResult<string | undefined> {
  const queryParam = testName;
  const liveParam = useMemo(
    () => btoa(JSON.stringify(queryParam)),
    [queryParam]
  );
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getUserABTestVariant,
        queryParam,
      },
      liveConfig: {
        live: carbonConnector.liveUserABTestVariant,
        liveParam,
      },
    },
    []
  );
}
