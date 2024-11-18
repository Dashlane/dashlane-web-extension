import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../carbonConnector";
export function usePaymentFailureChurningData() {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getIsPaymentFailureChurningDismissed,
      },
    },
    []
  );
}
