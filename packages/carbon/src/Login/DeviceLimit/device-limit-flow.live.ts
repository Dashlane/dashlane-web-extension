import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { StateOperator } from "Shared/Live";
import {
  loginDeviceLimitFlowSelector,
  viewedLoginDeviceLimitFlowSelector,
} from "Login/DeviceLimit/device-limit-flow.selectors";
import {
  LoginDeviceLimitFlow,
  LoginDeviceLimitFlowView,
} from "@dashlane/communication";
export const loginDeviceLimitFlow$ =
  (): StateOperator<LoginDeviceLimitFlow | null> =>
    pipe(
      map(loginDeviceLimitFlowSelector),
      distinctUntilChanged((lhs, rhs) => lhs?.name === rhs?.name)
    );
export const loginDeviceLimitFlowView$ =
  (): StateOperator<LoginDeviceLimitFlowView | null> =>
    pipe(
      map(viewedLoginDeviceLimitFlowSelector),
      distinctUntilChanged((lhs, rhs) => lhs?.name === rhs?.name)
    );
