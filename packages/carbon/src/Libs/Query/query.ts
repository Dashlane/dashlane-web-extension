import {
  FilterToken,
  Mappers,
  Match,
  SortToken,
} from "@dashlane/communication";
import { filterData } from "Libs/Query/filter";
import { sortData } from "Libs/Query/sort";
export function queryData<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  matcher: Match<D>,
  sortToken: SortToken<S>,
  filterToken: FilterToken<F>,
  data: D[]
): D[] {
  const filtered = filterData(mappers, matcher, filterToken, data);
  return sortData(mappers, sortToken, filtered);
}
