import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Result, success } from "@dashlane/framework-types";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import {
  TrustedDeviceFlowMachineContext,
  TrustedDeviceFlowMachineState,
} from "../flows/trusted-device-flow";
import { PASSPHRASE_SEPARATOR } from "../services/passphrase.service";
import { getDelayBeforeRequestExpiry } from "../utils/utils";
export function viewMapper(
  state: TrustedDeviceFlowMachineState
): DeviceTransferContracts.TrustedDeviceFlowView {
  if (
    state.matches("Idle") ||
    state.matches("WaitingForNewDeviceTransferRequest")
  ) {
    return {
      step: DeviceTransferContracts.TrustedDeviceFlowStep
        .WaitingForNewDeviceRequest,
    };
  }
  if (state.matches("NewDeviceTransferRequest")) {
    const delayBeforeRequestExpiry = getDelayBeforeRequestExpiry(
      state.context.requestTimestamp
    );
    if (delayBeforeRequestExpiry <= 0) {
      return {
        step: DeviceTransferContracts.TrustedDeviceFlowStep.Error,
        errorCode: DeviceTransferContracts.TrustedDeviceFlowErrors.TIMEOUT,
      };
    }
    return {
      step: DeviceTransferContracts.TrustedDeviceFlowStep
        .NewDeviceRequestAvailable,
      untrustedDeviceName: state.context.untrustedDeviceName,
      untrustedDeviceLocation: state.context.untrustedDeviceLocation,
      requestTimestamp: state.context.requestTimestamp,
    };
  }
  if (state.matches("HandlingDeviceTransferRequest")) {
    return {
      step: DeviceTransferContracts.TrustedDeviceFlowStep.LoadingChallenge,
    };
  }
  if (
    state.matches("DisplayPassphraseChallenge") ||
    state.matches("VerifyingPassphraseChallenge")
  ) {
    const {
      passphrase,
      passphraseMissingWordIndex,
      untrustedDeviceName,
      error,
    } = state.context as TrustedDeviceFlowMachineContext;
    const passphraseWithMissingWord = passphrase
      .split(PASSPHRASE_SEPARATOR)
      .map((word, index) => (index === passphraseMissingWordIndex ? "" : word));
    return {
      step: DeviceTransferContracts.TrustedDeviceFlowStep
        .DisplayPassphraseChallenge,
      untrustedDeviceName,
      passphrase: passphraseWithMissingWord,
      error,
    };
  }
  if (state.matches("DeviceTransferComplete")) {
    return {
      step: DeviceTransferContracts.TrustedDeviceFlowStep
        .DeviceTransferComplete,
      untrustedDeviceName: state.context.untrustedDeviceName,
    };
  }
  if (state.matches("DeviceTransferRejected")) {
    return {
      step: DeviceTransferContracts.TrustedDeviceFlowStep
        .DeviceTransferRejected,
      untrustedDeviceName: state.context.untrustedDeviceName,
    };
  }
  if (state.matches("DeviceTransferFailed")) {
    return {
      step: DeviceTransferContracts.TrustedDeviceFlowStep.Error,
      errorCode: state.context.error,
    };
  }
  throw new Error("[D2D Trusted Device] - No view associated to state");
}
const projectToView$ = (
  state: TrustedDeviceFlowMachineState
): Observable<Result<DeviceTransferContracts.TrustedDeviceFlowView>> => {
  return of(success(viewMapper(state)));
};
export const toView$ = (
  flowState$: Observable<TrustedDeviceFlowMachineState>
): Observable<Result<DeviceTransferContracts.TrustedDeviceFlowView>> =>
  flowState$.pipe(mergeMap(projectToView$));
