import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../carbonConnector";
export const useProtectPasswordsSetting = (): CarbonEndpointResult<boolean> => {
  return useCarbonEndpoint(
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
};
