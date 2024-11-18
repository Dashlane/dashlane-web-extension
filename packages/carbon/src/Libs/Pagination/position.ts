import { compose, curry, zip } from "ramda";
import { Mappers, SortCriterium, SortDirection } from "@dashlane/communication";
import { Token } from "Libs/Pagination/types";
import { normalizeStringMapper } from "Libs/Query";
type ZippedCriteriumValue<S extends string> = {
  0: SortCriterium<S>;
  1: string;
};
function isGreaterExclusive(v1: string, v2: string) {
  return v1 > v2;
}
function isSmallerExclusive(v1: string, v2: string) {
  return v1 < v2;
}
const isBeforeExclusive = (direction: SortDirection) =>
  direction === "ascend" ? isSmallerExclusive : isGreaterExclusive;
const isAfterExclusive = (direction: SortDirection) =>
  direction === "ascend" ? isGreaterExclusive : isSmallerExclusive;
function fieldValueGetter<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  field: S | F
) {
  return compose(normalizeStringMapper, mappers[field]);
}
const isAfterCriteriumExclusive = curry(function <
  D,
  S extends string,
  F extends string
>(
  mappers: Mappers<D, S, F>,
  item: D,
  { 0: criterium, 1: value }: ZippedCriteriumValue<S>
): boolean {
  const { direction, field } = criterium;
  const getFieldValue = fieldValueGetter(mappers, field);
  return isAfterExclusive(direction)(
    getFieldValue(item),
    normalizeStringMapper(value)
  );
});
const isBeforeCriteriumExclusive = curry(function <
  D,
  S extends string,
  F extends string
>(
  mappers: Mappers<D, S, F>,
  item: D,
  { 0: criterium, 1: value }: ZippedCriteriumValue<S>
): boolean {
  const { direction, field } = criterium;
  const getFieldValue = fieldValueGetter(mappers, field);
  return isBeforeExclusive(direction)(getFieldValue(item), value);
});
const isAtCriterium = curry(function <D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  item: D,
  { 0: criterium, 1: value }: ZippedCriteriumValue<S>
): boolean {
  const { field } = criterium;
  const getFieldValue = fieldValueGetter(mappers, field);
  return getFieldValue(item) === value;
});
function isDetermined(res: boolean | undefined): res is boolean {
  if (typeof res === "undefined") {
    return false;
  }
  return [true, false].includes(res);
}
function getUniqCriterium<S extends string>(uniqField: S): SortCriterium<S> {
  return {
    direction: "ascend",
    field: uniqField,
  };
}
function assertOnePosition<S extends string>(
  compares: (zipped: ZippedCriteriumValue<S>) => boolean,
  equals: (zipped: ZippedCriteriumValue<S>) => boolean,
  zipped: ZippedCriteriumValue<S>
): boolean | undefined {
  if (compares(zipped)) {
    return true;
  } else if (equals(zipped)) {
    return undefined;
  } else {
    return false;
  }
}
const assertPosition =
  <S extends string>(
    compares: (zipped: ZippedCriteriumValue<S>) => boolean,
    equals: (zipped: ZippedCriteriumValue<S>) => boolean
  ) =>
  (zippedList: ZippedCriteriumValue<S>[]): boolean | undefined => {
    return zippedList.reduce(
      (
        res: boolean | undefined,
        zipped: ZippedCriteriumValue<S>
      ): boolean | undefined => {
        if (isDetermined(res)) {
          return res;
        }
        return assertOnePosition(compares, equals, zipped);
      },
      undefined
    );
  };
const position =
  <D, S extends string, F extends string>(
    position: "before" | "after",
    cursorPosition: "start" | "end"
  ) =>
  (
    mappers: Mappers<D, S, F>,
    token: Token<S, F>,
    exclusive: boolean,
    item: D
  ): boolean => {
    const { sortCriteria, uniqField } = token.sortToken;
    const cursor =
      cursorPosition === "start" ? token.startCursor : token.endCursor;
    if (cursor.type === "zero") {
      return position === "after";
    }
    if (cursor.type === "infinite") {
      return position === "before";
    }
    const equals: (zipped: ZippedCriteriumValue<S>) => boolean = isAtCriterium(
      mappers,
      item
    );
    const compares: (zipped: ZippedCriteriumValue<S>) => boolean =
      position === "before"
        ? isBeforeCriteriumExclusive(mappers, item)
        : isAfterCriteriumExclusive(mappers, item);
    const assert = assertPosition(compares, equals);
    const zipped = zip(sortCriteria, cursor.sortValues);
    const positionned = assert(zipped);
    if (isDetermined(positionned)) {
      return positionned;
    }
    const uniqZipped = {
      0: getUniqCriterium(uniqField),
      1: cursor.uniqValue,
    };
    const hasCorrectExclusiveUniqValue = assert([uniqZipped]);
    return isDetermined(hasCorrectExclusiveUniqValue)
      ? hasCorrectExclusiveUniqValue
      : !exclusive;
  };
export const isAfterTokenStart = position("after", "start");
export const isBeforeTokenEnd = position("before", "end");
export const isAfterTokenEnd = position("after", "end");
export const isBeforeTokenStart = position("before", "start");
