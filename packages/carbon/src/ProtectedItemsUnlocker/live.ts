import { pipe } from "rxjs";
import { vaultLockDateSelector } from "ProtectedItemsUnlocker/selectors";
import { map } from "rxjs/operators";
import { StateOperator } from "Shared/Live";
export const vaultLockDate$ = (): StateOperator<number | null> => {
  return pipe(map(vaultLockDateSelector));
};
