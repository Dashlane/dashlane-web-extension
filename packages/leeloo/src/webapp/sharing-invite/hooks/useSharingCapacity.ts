import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { SharingCapacity } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
export const useSharingCapacity = (): SharingCapacity | null => {
  const result = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getSharingCapacity,
      },
      liveConfig: {
        live: carbonConnector.liveSharingCapacity,
      },
    },
    []
  );
  return result.status === DataStatus.Success ? result.data : null;
};
