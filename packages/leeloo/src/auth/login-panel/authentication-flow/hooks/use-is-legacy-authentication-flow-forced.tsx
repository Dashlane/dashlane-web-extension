import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../../libs/carbon/connector";
export function useIsLegacyAuthenticationFlowForced(): {
  loading: boolean;
  data?: boolean;
} {
  const isExtngLoginFlowDisabled = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getIsLoginFlowMigrationDisabled,
      },
      liveConfig: {
        live: carbonConnector.liveIsLoginFlowMigrationDisabled,
      },
    },
    []
  );
  if (isExtngLoginFlowDisabled.status !== DataStatus.Success) {
    return { loading: true };
  }
  return { loading: false, data: isExtngLoginFlowDisabled.data };
}
