import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { DataQuery, ListResults } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { State } from "Store";
import { parseToken } from "Libs/Query";
import { sameBatch } from "Libs/Pagination/same-batch";
type LivePersonalInfoOperator<V> = (
  stringToken: string
) => StateOperator<ListResults<V>>;
export const getLivePersonalInfo = <V, S extends string, F extends string>(
  liveGetter: (query: DataQuery<S, F>) => (state: State) => ListResults<V>
): LivePersonalInfoOperator<V> => {
  return (stringToken) => {
    const query = parseToken(stringToken);
    const selector = liveGetter(query);
    return pipe(
      map(selector),
      distinctUntilChanged(
        (r1, r2) =>
          sameBatch(r1.items, r2.items) && r1.matchingCount === r2.matchingCount
      )
    );
  };
};
