import {
  combineLatest,
  map,
  Observable,
  startWith,
  switchMap,
  timer,
} from "rxjs";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { equals } from "ramda";
import { Result } from "@dashlane/framework-types";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { TrustedDeviceFlow } from "../../services/trusted-device-flow.instance.service";
import {
  deserialize$,
  TrustedDeviceFlowMachineStore,
} from "../../stores/trusted-device-flow-machine.store";
import { toView$ } from "../../views/trusted-device-flow-machine.view";
import { getDelayBeforeRequestExpiry } from "../../utils/utils";
@QueryHandler(DeviceTransferContracts.TrustedDeviceFlowStatusQuery)
export class TrustedDeviceFlowStatusQueryHandler
  implements
    IQueryHandler<DeviceTransferContracts.TrustedDeviceFlowStatusQuery>
{
  private trustedDeviceFlowMachineStore: TrustedDeviceFlowMachineStore;
  private trustedDeviceFlow: TrustedDeviceFlow;
  constructor(
    trustedDeviceFlow: TrustedDeviceFlow,
    trustedDeviceFlowMachineStore: TrustedDeviceFlowMachineStore
  ) {
    this.trustedDeviceFlow = trustedDeviceFlow;
    this.trustedDeviceFlowMachineStore = trustedDeviceFlowMachineStore;
  }
  public execute(): Observable<
    Result<DeviceTransferContracts.TrustedDeviceFlowView>
  > {
    const delayBeforeRequestExpiry$ = deserialize$(
      this.trustedDeviceFlowMachineStore
    ).pipe(
      filter(Boolean),
      map((machine) =>
        machine.context.requestTimestamp
          ? getDelayBeforeRequestExpiry(machine.context.requestTimestamp)
          : 0
      )
    );
    const refreshFlowTimer$ = delayBeforeRequestExpiry$.pipe(
      switchMap((timeBeforeExpiry) => timer(timeBeforeExpiry)),
      startWith(0)
    );
    return combineLatest(
      [
        deserialize$(this.trustedDeviceFlowMachineStore),
        this.trustedDeviceFlow.ready(),
        refreshFlowTimer$,
      ],
      (storeObservableData, flowReadyObservableFlag, _) => {
        if (storeObservableData && flowReadyObservableFlag) {
          return storeObservableData;
        }
      }
    ).pipe(
      filter(Boolean),
      toView$,
      distinctUntilChanged((prev, curr) => equals(prev, curr))
    );
  }
}
