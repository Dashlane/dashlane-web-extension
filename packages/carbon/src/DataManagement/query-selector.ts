import {
  DataQuery,
  ListResults,
  Mappers,
  Match,
} from "@dashlane/communication";
import { State } from "Store";
import { filterData } from "Libs/Query";
import { sortData } from "Libs/Query/sort";
export type SortedFilteredSelector<D, S extends string, F extends string> = (
  state: State,
  tokens: DataQuery<S, F>
) => ListResults<D>;
export const getQuerySelector = <D, S extends string, F extends string>(
  selector: (state: State) => D[],
  matcherSelector: (state: State) => Match<D>,
  mappersSelector: (state: State) => Mappers<D, S, F>
): SortedFilteredSelector<D, S, F> => {
  return (state, query) => {
    const items = selector(state);
    const mappers = mappersSelector(state);
    const matcher = matcherSelector(state);
    return applyQuery(matcher, mappers, query, items);
  };
};
export const applyQuery = <D, S extends string, F extends string>(
  matcher: Match<D>,
  mappers: Mappers<D, S, F>,
  query: DataQuery<S, F>,
  items: D[]
): ListResults<D> => {
  const { sortToken, filterToken, limit } = query;
  const filter = (items: D[]) =>
    filterData(mappers, matcher, filterToken, items);
  const sort = (items: D[]) => sortData(mappers, sortToken, items);
  const filtered = filter(items);
  const sorted = sort(filtered);
  const limited = limit ? sorted.slice(0, limit) : sorted;
  return {
    items: limited,
    matchingCount: sorted.length,
  };
};
