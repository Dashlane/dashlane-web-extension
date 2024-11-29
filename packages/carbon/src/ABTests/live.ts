import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { userABTestVariantSelector } from "Session/Store/abTests/selector";
import { StateOperator } from "Shared/Live";
import { State } from "Store";
export const userABTestVariant$ = (testName: string): StateOperator<string> => {
  const selector = (state: State) => userABTestVariantSelector(state, testName);
  return pipe(map(selector), distinctUntilChanged());
};
