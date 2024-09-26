import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import {
  BreachDetailItemView,
  BreachesUpdaterStatus,
  BreachItemView,
} from "@dashlane/communication";
import { parseToken } from "Libs/Query";
import { sameBatch } from "Libs/Pagination/same-batch";
import { StateOperator } from "Shared/Live";
import { getLivePersonalInfo } from "DataManagement/PersonalInfo/live";
import {
  breachesUpdaterStatusSelector,
  getLiveBreachesSelector,
  getViewedBreachesBatchSelector,
  getViewedBreachSelector,
} from "DataManagement/Breaches/selectors";
export const breachesBatch$ = (
  stringToken: string
): StateOperator<BreachItemView[]> => {
  const token = parseToken(stringToken);
  const selector = getViewedBreachesBatchSelector(token);
  return pipe(map(selector), distinctUntilChanged(sameBatch));
};
export const breaches$ = getLivePersonalInfo(getLiveBreachesSelector);
export function getBreach$(
  id: string
): StateOperator<BreachDetailItemView | undefined> {
  const selector = getViewedBreachSelector(id);
  return pipe(map(selector), distinctUntilChanged());
}
export const breachesUpdaterStatus$ =
  (): StateOperator<BreachesUpdaterStatus> =>
    pipe(map(breachesUpdaterStatusSelector), distinctUntilChanged());
