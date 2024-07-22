import { map, Observable } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { Result, success } from "@dashlane/framework-types";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { SsoProviderInfoState, SsoProviderInfoStore } from "../../stores";
@QueryHandler(AuthenticationFlowContracts.GetSsoProviderInfoQuery)
export class SsoProviderInfoQueryStatusHandler
  implements IQueryHandler<AuthenticationFlowContracts.GetSsoProviderInfoQuery>
{
  constructor(private ssoProviderInfoStore: SsoProviderInfoStore) {
    this.ssoProviderInfoStore = ssoProviderInfoStore;
  }
  public execute(): Observable<
    Result<AuthenticationFlowContracts.GetSsoProviderInfoQueryResult>
  > {
    return this.ssoProviderInfoStore.state$.pipe(
      map((state: SsoProviderInfoState) =>
        success({
          serviceProviderUrl: state.serviceProviderUrl,
          isNitroProvider: state.isNitroProvider,
          migrationType: state.migrationType,
        })
      )
    );
  }
}
