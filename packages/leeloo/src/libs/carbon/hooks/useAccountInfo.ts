import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { AccountInfo } from "@dashlane/communication";
import { carbonConnector } from "../connector";
export function useAccountInfo(): AccountInfo | null {
  const accountInfo = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getAccountInfo,
        queryParam: null,
      },
    },
    []
  );
  if (accountInfo.status !== DataStatus.Success) {
    return null;
  }
  return accountInfo.data;
}
