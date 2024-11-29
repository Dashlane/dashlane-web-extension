import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { PremiumStatus } from "@dashlane/communication";
import { carbonConnector } from "../connector";
export function usePremiumStatus(): CarbonEndpointResult<PremiumStatus> {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getPremiumStatus,
      },
    },
    []
  );
}
