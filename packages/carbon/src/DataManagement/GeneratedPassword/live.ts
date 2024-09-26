import {
  countAllGeneratedPasswordsSelector,
  getLiveGeneratedPasswordsSelector,
} from "DataManagement/GeneratedPassword/selectors";
import { getLivePersonalInfo } from "DataManagement/PersonalInfo/live";
import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { StateOperator } from "Shared/Live";
export const generatedPasswordCount$ = (): StateOperator<number> => {
  return pipe(map(countAllGeneratedPasswordsSelector), distinctUntilChanged());
};
export const generatedPasswords$ = getLivePersonalInfo(
  getLiveGeneratedPasswordsSelector
);
