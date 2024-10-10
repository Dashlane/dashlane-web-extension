import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { ReactivationStatus } from "Authentication/Store/localAccounts/types";
import { reactivationStatusSelector } from "Authentication/selectors";
import { StateOperator } from "Shared/Live";
export const reactivationStatus$ = (): StateOperator<ReactivationStatus> =>
  pipe(map(reactivationStatusSelector), distinctUntilChanged());
