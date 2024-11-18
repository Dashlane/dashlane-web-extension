import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { UserMessage } from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
export function useVisibleUserMessages(): UserMessage[] {
  const result = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getVisibleUserMessages,
      },
      liveConfig: {
        live: carbonConnector.liveVisibleUserMessages,
      },
    },
    []
  );
  return result.status === DataStatus.Success ? result.data : [];
}
