import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { StateOperator } from "Shared/Live";
import { antiPhishingURLListSelector } from "./selectors";
export const antiPhishingURLList$ = (): StateOperator<Set<string>> =>
  pipe(map(antiPhishingURLListSelector), distinctUntilChanged());
