import { Observable } from "rxjs";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { Result } from "@dashlane/framework-types";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { toView$ } from "../../views/authentication-flow-machine.view";
import {
  AuthenticationFlowMachineStore,
  deserialize$,
} from "../../stores/authentication-flow-machine.store";
import { compareMachines } from "../../utils/utils";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
@QueryHandler(AuthenticationFlowContracts.AuthenticationFlowStatusQuery)
export class AuthenticationFlowQueryStatusHandler
  implements
    IQueryHandler<AuthenticationFlowContracts.AuthenticationFlowStatusQuery>
{
  private loginMachineStore: AuthenticationFlowMachineStore;
  private authenticationFlow: AuthenticationFlow;
  constructor(
    authenticationFlow: AuthenticationFlow,
    loginMachineStore: AuthenticationFlowMachineStore
  ) {
    this.authenticationFlow = authenticationFlow;
    this.loginMachineStore = loginMachineStore;
  }
  public execute(): Observable<
    Result<AuthenticationFlowContracts.AuthenticationFlowView>
  > {
    return deserialize$(this.loginMachineStore).pipe(
      filter(Boolean),
      distinctUntilChanged((prev, curr) => compareMachines(prev, curr)),
      toView$
    );
  }
}
