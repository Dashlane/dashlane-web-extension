import { combineLatest, Observable } from "rxjs";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { Result } from "@dashlane/framework-types";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { toView$ } from "../../views/identity-verification-flow-machine.view";
import {
  deserialize$,
  IdentityVerificationFlowMachineStore,
} from "../../stores/identity-verification-flow-machine.store";
import { compareMachines } from "../../utils/utils";
import { IdentityVerificationFlow } from "../../services/identity-verification-flow.instance.service";
@QueryHandler(
  IdentityVerificationFlowContracts.IdentityVerificationFlowStatusQuery
)
export class IdentityVerificationFlowQueryStatusHandler
  implements
    IQueryHandler<IdentityVerificationFlowContracts.IdentityVerificationFlowStatusQuery>
{
  private identityVerificationMachineStore: IdentityVerificationFlowMachineStore;
  private identityVerificationFlow: IdentityVerificationFlow;
  constructor(
    identityVerificationFlow: IdentityVerificationFlow,
    loginMachineStore: IdentityVerificationFlowMachineStore
  ) {
    this.identityVerificationFlow = identityVerificationFlow;
    this.identityVerificationMachineStore = loginMachineStore;
  }
  public execute(): Observable<
    Result<IdentityVerificationFlowContracts.IdentityVerificationFlowView>
  > {
    return combineLatest(
      [
        deserialize$(this.identityVerificationMachineStore),
        this.identityVerificationFlow.ready(),
      ],
      (storeObservableData, flowReadyObservableFlag) => {
        if (storeObservableData && flowReadyObservableFlag) {
          return storeObservableData;
        }
      }
    ).pipe(
      filter(Boolean),
      distinctUntilChanged((prev, curr) => compareMachines(prev, curr)),
      toView$
    );
  }
}
