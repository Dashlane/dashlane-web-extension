import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../carbonConnector";
export const useWebAuthnAuthenticationOptedIn = (): boolean => {
  const webAuthnAuthenticationOptedIn = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getWebAuthnAuthenticationOptedIn,
      },
      liveConfig: {
        live: carbonConnector.liveWebAuthnAuthenticationOptedIn,
      },
    },
    []
  );
  return (
    webAuthnAuthenticationOptedIn.status === DataStatus.Success &&
    webAuthnAuthenticationOptedIn.data
  );
};
