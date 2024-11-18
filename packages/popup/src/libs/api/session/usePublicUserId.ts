import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../carbonConnector";
export const usePublicUserId = () =>
  useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getPublicUserId,
      },
    },
    []
  );
