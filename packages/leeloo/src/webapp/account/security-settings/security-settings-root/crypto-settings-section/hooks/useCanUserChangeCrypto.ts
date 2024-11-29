import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../../../../libs/carbon/connector";
export function useCanUserChangeCrypto(): boolean {
  const result = useCarbonEndpoint(
    {
      queryConfig: { query: carbonConnector.getCanUserChangeCrypto },
    },
    []
  );
  return result.status === DataStatus.Success && result.data;
}
