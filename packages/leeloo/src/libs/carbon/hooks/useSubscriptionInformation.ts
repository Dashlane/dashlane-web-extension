import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { SubscriptionInformation } from "@dashlane/communication";
import { carbonConnector } from "../connector";
export function useSubscriptionInformation(): CarbonEndpointResult<SubscriptionInformation> {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getSubscriptionInformation,
      },
      liveConfig: {
        live: carbonConnector.liveSubscriptionInformation,
      },
    },
    []
  );
}
