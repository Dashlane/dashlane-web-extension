import { map, Observable } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { Result, success } from "@dashlane/framework-types";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { SsoUserSettingsState, SsoUserSettingsStore } from "../../stores";
@QueryHandler(AuthenticationFlowContracts.GetSsoUserSettingsQuery)
export class SsoUserSettingsQueryStatusHandler
  implements IQueryHandler<AuthenticationFlowContracts.GetSsoUserSettingsQuery>
{
  constructor(private ssoUserSettingsStore: SsoUserSettingsStore) {
    this.ssoUserSettingsStore = ssoUserSettingsStore;
  }
  public execute(): Observable<
    Result<AuthenticationFlowContracts.GetSsoUserSettingsQueryResult>
  > {
    return this.ssoUserSettingsStore.state$.pipe(
      map((state: SsoUserSettingsState) =>
        success({
          rememberMeForSSOPreference: state.rememberMeForSSOPreference,
        })
      )
    );
  }
}
