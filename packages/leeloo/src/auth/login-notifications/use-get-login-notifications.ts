import {
  CarbonEndpointResult,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { LoginNotification } from "@dashlane/communication";
import { carbonConnector } from "../../libs/carbon/connector";
export function useGetLoginNotifications(): CarbonEndpointResult<
  LoginNotification[] | undefined
> {
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getLoginNotifications,
      },
      liveConfig: {
        live: carbonConnector.liveLoginNotifications,
      },
    },
    []
  );
}
