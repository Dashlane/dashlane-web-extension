import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../../libs/carbon/connector";
export function useHasSsoToken(): boolean {
  const ssoMigrationInfo = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getSSOMigrationInfo,
      },
    },
    []
  );
  if (ssoMigrationInfo.status !== DataStatus.Success) {
    return false;
  }
  return (
    ssoMigrationInfo.data.migration ===
    AuthenticationFlowContracts.SSOMigrationType.MP_TO_SSO_WITH_INFO
  );
}
