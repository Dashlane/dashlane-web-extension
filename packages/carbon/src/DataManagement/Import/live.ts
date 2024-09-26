import { ImportPersonalDataState } from "@dashlane/communication";
import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { StateOperator } from "Shared/Live";
import { importPersonalDataStateSelector } from "./selectors";
export const importPersonalDataState$ =
  (): StateOperator<ImportPersonalDataState> =>
    pipe(map(importPersonalDataStateSelector, distinctUntilChanged()));
