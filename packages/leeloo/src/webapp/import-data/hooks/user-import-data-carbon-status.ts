import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../libs/carbon/connector";
export const useImportDataCarbonStatus = () => {
  const carbonStatusQuery = useCarbonEndpoint(
    {
      queryConfig: {
        queryParam: undefined,
        query: carbonConnector.getImportPersonalDataStatus,
      },
      liveConfig: {
        live: carbonConnector.liveImportPersonalDataStatus,
      },
    },
    []
  );
  return carbonStatusQuery.status === DataStatus.Success
    ? carbonStatusQuery.data
    : undefined;
};
