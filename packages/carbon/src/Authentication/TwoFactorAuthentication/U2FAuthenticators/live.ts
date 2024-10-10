import { StateOperator } from "Shared/Live";
import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { U2FDevice } from "@dashlane/communication";
import { listU2FDevicesSelector } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/selectors";
export const listU2FDevices$ = (): StateOperator<U2FDevice[]> =>
  pipe(map(listU2FDevicesSelector), distinctUntilChanged());
