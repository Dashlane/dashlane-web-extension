import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../carbonConnector";
export const useSpaces = () => {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getSpaces,
      },
    },
    []
  );
};
