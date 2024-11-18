import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../carbonConnector";
export function useCredentialData(credentialId: string) {
  return useCarbonEndpoint(
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
}
