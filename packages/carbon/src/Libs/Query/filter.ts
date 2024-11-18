import { compose } from "ramda";
import {
  FilterCriterium,
  FilterToken,
  Mappers,
  Match,
} from "@dashlane/communication";
import { normalizeStringMapper } from "Libs/Query/mappers";
import { assertUnreachable } from "Helpers/assert-unreachable";
function getFilterPredicate<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  matcher: Match<D>,
  criterium: FilterCriterium<F>
): (d: D) => boolean {
  const { value } = criterium;
  const filterVal = normalizeStringMapper(value);
  const getFieldValue = (field: S | F) =>
    compose(normalizeStringMapper, mappers[field]);
  switch (criterium.type) {
    case "equals": {
      return (d: D) => getFieldValue(criterium.field)(d) === filterVal;
    }
    case "differs": {
      return (d: D) => getFieldValue(criterium.field)(d) !== filterVal;
    }
    case "matches": {
      return (d: D) => matcher(filterVal, d);
    }
    case "in": {
      return (d: D) => {
        const fieldValue = getFieldValue(criterium.field)(d);
        return filterVal.indexOf(fieldValue) > -1;
      };
    }
    case "contains": {
      return (d: D) => {
        const fieldValue = getFieldValue(criterium.field)(d);
        if (!Array.isArray(fieldValue)) {
          throw new Error("[Query] - filter: expected an array");
        }
        return fieldValue.includes(filterVal);
      };
    }
    default:
      assertUnreachable(criterium);
  }
}
export function filterData<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  matcher: Match<D>,
  filterToken: FilterToken<F>,
  data: D[]
): D[] {
  return filterToken.filterCriteria.reduce(
    (data: D[], filterCriterium: FilterCriterium<F>) => {
      const predicate = getFilterPredicate(mappers, matcher, filterCriterium);
      return data.filter(predicate);
    },
    data
  );
}
