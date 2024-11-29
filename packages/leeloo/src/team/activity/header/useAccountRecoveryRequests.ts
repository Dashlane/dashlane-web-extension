import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../libs/carbon/connector";
export function useGetAccountRecoveryRequestsCount(): CarbonEndpointResult<number> {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getAccountRecoveryRequestCount,
      },
      liveConfig: {
        live: carbonConnector.liveAccountRecoveryRequestCount,
      },
    },
    []
  );
}
