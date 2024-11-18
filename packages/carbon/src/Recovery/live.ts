import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { State } from "Store/types";
import { StateOperator } from "Shared/Live";
import { accountRecoveryRequestsCountSelector } from "Recovery/selectors";
export function accountRecoveryRequestsCount$(): StateOperator<number> {
  const selector = (state: State) =>
    accountRecoveryRequestsCountSelector(state);
  return pipe(map(selector), distinctUntilChanged());
}
