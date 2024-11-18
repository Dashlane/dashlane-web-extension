import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { mapSuccessObservable } from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import { CredentialsGloballyProtectedQuery } from "@dashlane/vault-contracts";
@QueryHandler(CredentialsGloballyProtectedQuery)
export class CredentialsGloballyProtectedQueryHandler
  implements IQueryHandler<CredentialsGloballyProtectedQuery>
{
  constructor(private carbonLegacyClient: CarbonLegacyClient) {}
  public execute(): QueryHandlerResponseOf<CredentialsGloballyProtectedQuery> {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    return carbonState({
      path: "userSession.personalSettings.ProtectPasswords",
    }).pipe(
      mapSuccessObservable((isProtected) => {
        if (typeof isProtected !== "boolean") {
          throw new Error("Fail to get ProtectPasswords setting");
        }
        return isProtected;
      })
    );
  }
}
