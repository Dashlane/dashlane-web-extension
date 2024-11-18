import { normalizeStringMapper } from "Libs/Query/mappers";
import {
  Mappers,
  SortCriterium,
  SortDirection,
  SortToken,
} from "@dashlane/communication";
import { ascend, compose, descend, sortWith } from "ramda";
function getFieldSorter(direction: SortDirection) {
  return direction === "ascend" ? ascend : descend;
}
function getCriteriumMapper<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  sortCriterium: SortCriterium<S>
): (d: D) => string {
  const { field } = sortCriterium;
  return compose(normalizeStringMapper, mappers[field]);
}
function getCriteriumComparator<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  sortCriterium: SortCriterium<S>
): (a: D, b: D) => number {
  const { direction } = sortCriterium;
  const mapper = getCriteriumMapper(mappers, sortCriterium);
  return getFieldSorter(direction)(mapper);
}
export function sortData<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  sortToken: SortToken<S>,
  data: D[]
): D[] {
  const getCriteriumComparatorWithMappers = (sc: SortCriterium<S>) =>
    getCriteriumComparator(mappers, sc);
  const uniqComparatorMapper = compose(String, mappers[sortToken.uniqField]);
  const comparators = [
    ...sortToken.sortCriteria.map(getCriteriumComparatorWithMappers),
    ascend(uniqComparatorMapper),
  ];
  const tokenSort = sortWith<D>(comparators);
  const out = tokenSort(data);
  return out;
}
