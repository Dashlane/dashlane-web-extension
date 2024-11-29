import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../connector";
export const useProtectPasswordsSetting = (): CarbonEndpointResult<boolean> =>
  useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.arePasswordsProtected,
      },
      liveConfig: {
        live: carbonConnector.liveArePasswordsProtected,
      },
    },
    []
  );
