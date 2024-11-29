import {
  CarbonEndpointResult,
  DataStatus,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../../libs/carbon/connector";
export function useIsSSOUser(): boolean {
  const isSSOUser: CarbonEndpointResult<boolean> = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getIsSSOUser,
      },
    },
    []
  );
  if (isSSOUser.status === DataStatus.Success && isSSOUser.data) {
    return true;
  }
  return false;
}
