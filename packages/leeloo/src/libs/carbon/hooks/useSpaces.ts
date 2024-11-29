import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { PremiumStatusSpace } from "@dashlane/communication";
import { carbonConnector } from "../connector";
export const useSpaces = (): CarbonEndpointResult<PremiumStatusSpace[]> => {
  const result = useCarbonEndpoint(
    {
      queryConfig: { query: carbonConnector.getActiveSpaces },
    },
    []
  );
  return result;
};
