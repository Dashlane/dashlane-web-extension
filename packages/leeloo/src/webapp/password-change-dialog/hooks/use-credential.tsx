import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../libs/carbon/connector";
export const useCredential = (credentialId: string) =>
  useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getCredential,
        queryParam: credentialId,
      },
      liveConfig: {
        live: carbonConnector.liveCredential,
        liveParam: credentialId,
      },
    },
    [credentialId]
  );
