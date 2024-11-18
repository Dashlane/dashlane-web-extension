import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { VpnAccountStatus } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { vpnAccountStatusSelector } from "./selectors";
export function vpnAccountStatus$(): StateOperator<VpnAccountStatus> {
  const selector = vpnAccountStatusSelector;
  return pipe(map(selector), distinctUntilChanged());
}
