import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { KillSwitches } from "@dashlane/framework-contracts";
import { StateOperator } from "Shared/Live";
import {
  disableAutoSSOLoginSelector,
  disableBrazeContentCardsSelector,
  disableLoginFlowMigrationSelector,
  getKillSwitchSelector,
} from "Killswitch/selectors";
export const disableBrazeContentCardsOperator$ = (): StateOperator<boolean> =>
  pipe(map(disableBrazeContentCardsSelector), distinctUntilChanged());
export const disableLoginFlowMigrationOperator$ = (): StateOperator<boolean> =>
  pipe(map(disableLoginFlowMigrationSelector), distinctUntilChanged());
export const disableAutoSSOLoginOperator$ = (): StateOperator<boolean> =>
  pipe(map(disableAutoSSOLoginSelector), distinctUntilChanged());
export const getKillSwitchOperator$ = (
  killswitch: KillSwitches
): StateOperator<boolean> => {
  const selector = getKillSwitchSelector(killswitch);
  return pipe(map(selector), distinctUntilChanged());
};
