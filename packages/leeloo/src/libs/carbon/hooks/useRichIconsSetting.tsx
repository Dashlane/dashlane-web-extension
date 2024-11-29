import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../connector";
export const useRichIconsSetting = (): CarbonEndpointResult<boolean> =>
  useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.areRichIconsEnabled,
      },
      liveConfig: {
        live: carbonConnector.liveAreRichIconsEnabled,
      },
    },
    []
  );
