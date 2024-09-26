import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { PasskeyDetailView } from "@dashlane/communication";
import { getLivePersonalInfo } from "DataManagement/PersonalInfo/live";
import {
  getLivePasskeysSelector,
  getViewedPasskeySelector,
} from "DataManagement/Passkeys/selectors";
import { StateOperator } from "Shared/Live";
export const passkeys$ = getLivePersonalInfo(getLivePasskeysSelector);
export const getPasskey$ = (
  id: string
): StateOperator<PasskeyDetailView | undefined> => {
  const selector = getViewedPasskeySelector(id);
  return pipe(map(selector), distinctUntilChanged());
};
