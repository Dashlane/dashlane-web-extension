import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { PaymentUpdateToken } from "@dashlane/communication";
import { carbonConnector } from "../connector";
export function useRequestPaymentUpdateAuthenticationToken(): CarbonEndpointResult<PaymentUpdateToken> {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.requestPaymentUpdateAuthenticationToken,
      },
    },
    []
  );
}
