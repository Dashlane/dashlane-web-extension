import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../carbonConnector";
export const useDidOpen = () => {
  const result = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getDidOpen,
        queryParam: undefined,
      },
      liveConfig: {
        live: carbonConnector.liveDidOpen,
      },
    },
    []
  );
  return result.status === DataStatus.Success ? result.data : false;
};
