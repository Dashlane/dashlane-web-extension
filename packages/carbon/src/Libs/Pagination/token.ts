import { compose } from "ramda";
import {
  DataQuery,
  Mappers,
  SortCriterium,
  SortToken,
} from "@dashlane/communication";
import {
  EndCursor,
  InfiniteCursor,
  PositionCursor,
  StartCursor,
  Token,
  ZeroCursor,
} from "Libs/Pagination/types";
import { normalizeStringMapper } from "Libs/Query";
import { binaryFindIndex, binaryFindLastIndex } from "Libs/BinarySearches";
import { isAfterTokenEnd, isBeforeTokenStart } from "Libs/Pagination/position";
export const infiniteCursor: InfiniteCursor = {
  type: "infinite",
};
export const zeroCursor: ZeroCursor = {
  type: "zero",
};
function getCursorValues<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  item: D,
  token: SortToken<S>
): string[] {
  const valueGetter = (sortCriterium: SortCriterium<S>) => {
    const { field } = sortCriterium;
    const getValue = compose(normalizeStringMapper, mappers[field]);
    return getValue(item);
  };
  return token.sortCriteria.map(valueGetter);
}
function getEndCursorFromStartPosition<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  sortToken: SortToken<S>,
  initialBatchSize: number,
  startPosition: number,
  sortedData: D[]
): EndCursor {
  const elementsCount = sortedData.length;
  const endPosition = startPosition + initialBatchSize - 1;
  if (endPosition >= elementsCount - 1) {
    return infiniteCursor;
  }
  const nextElement = sortedData[endPosition];
  const cursorValues = getCursorValues(mappers, nextElement, sortToken);
  const endCursor: PositionCursor = {
    type: "positional",
    sortValues: cursorValues,
    uniqValue: String(mappers[sortToken.uniqField](nextElement)),
  };
  return endCursor;
}
function getStartCursorFromEndPosition<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  sortToken: SortToken<S>,
  initialBatchSize: number,
  endPosition: number,
  sortedData: D[]
): StartCursor {
  const startPosition = endPosition - initialBatchSize + 1;
  if (startPosition < 0) {
    return zeroCursor;
  }
  const prevElement = sortedData[startPosition];
  const cursorValues = getCursorValues(mappers, prevElement, sortToken);
  const startCursor: PositionCursor = {
    type: "positional",
    sortValues: cursorValues,
    uniqValue: String(mappers[sortToken.uniqField](prevElement)),
  };
  return startCursor;
}
function getNextEndCursorFromToken<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  token: Token<S, F>,
  sortedData: D[]
): EndCursor {
  const { initialBatchSize, endCursor, sortToken } = token;
  if (endCursor.type === "infinite") {
    throw new Error("Cannot generate cursor after infinite end cursor.");
  }
  const nextElementIndex = binaryFindIndex(sortedData, (item: D) =>
    isAfterTokenEnd(mappers, token, false, item)
  );
  if (nextElementIndex === -1) {
    return infiniteCursor;
  }
  const nextEndCursor = getEndCursorFromStartPosition(
    mappers,
    sortToken,
    initialBatchSize,
    nextElementIndex,
    sortedData
  );
  return nextEndCursor;
}
function getPreviousStartCursorFromToken<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  token: Token<S, F>,
  sortedData: D[]
): StartCursor {
  const { initialBatchSize, startCursor, sortToken } = token;
  if (startCursor.type === "zero") {
    throw new Error("Cannot generate cursor before zero start cursor.");
  }
  const prevElementIndex = binaryFindLastIndex(sortedData, (item: D) =>
    isBeforeTokenStart(mappers, token, true, item)
  );
  if (prevElementIndex === -1) {
    return zeroCursor;
  }
  const prevStartCursor = getStartCursorFromEndPosition(
    mappers,
    sortToken,
    initialBatchSize,
    prevElementIndex,
    sortedData
  );
  return prevStartCursor;
}
export function generateNextToken<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  currentToken: Token<S, F>,
  sortedData: D[]
): Token<S, F> | undefined {
  if (currentToken.endCursor.type === "infinite") {
    return undefined;
  }
  const endCursor = getNextEndCursorFromToken(
    mappers,
    currentToken,
    sortedData
  );
  const res = {
    ...currentToken,
    startCursor: currentToken.endCursor,
    endCursor,
  };
  return res;
}
export function generatePrevToken<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  currentToken: Token<S, F>,
  sortedData: D[]
): Token<S, F> | undefined {
  if (currentToken.startCursor.type === "zero") {
    return undefined;
  }
  const startCursor = getPreviousStartCursorFromToken(
    mappers,
    currentToken,
    sortedData
  );
  const res = {
    ...currentToken,
    startCursor,
    endCursor: currentToken.startCursor,
  };
  return res;
}
export function generateFirstToken<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  tokens: DataQuery<S, F>,
  initialBatchSize: number,
  sortedData: D[]
): Token<S, F> {
  const { sortToken, filterToken } = tokens;
  const endCursor = getEndCursorFromStartPosition(
    mappers,
    sortToken,
    initialBatchSize,
    0,
    sortedData
  );
  return {
    sortToken,
    filterToken,
    initialBatchSize,
    startCursor: zeroCursor,
    endCursor,
  };
}
