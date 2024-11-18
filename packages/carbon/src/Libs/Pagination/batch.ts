import { Mappers } from "@dashlane/communication";
import { isAfterTokenEnd, isAfterTokenStart } from "Libs/Pagination/position";
import { Token } from "Libs/Pagination/types";
import { binaryFindIndex } from "Libs/BinarySearches";
export function getBatch<D, S extends string, F extends string>(
  mappers: Mappers<D, S, F>,
  token: Token<S, F>,
  data: D[]
): D[] {
  const startIndex =
    token.startCursor.type === "zero"
      ? 0
      : binaryFindIndex(data, (item: D) =>
          isAfterTokenStart(mappers, token, false, item)
        );
  if (startIndex === -1) {
    return [];
  }
  const afterStartSequence = data.slice(startIndex);
  const endIndex =
    token.endCursor.type === "infinite"
      ? afterStartSequence.length
      : binaryFindIndex(
          afterStartSequence,
          (item: D) => isAfterTokenEnd(mappers, token, false, item),
          token.initialBatchSize
        );
  const sliceEnd = endIndex === -1 ? afterStartSequence.length : endIndex;
  const res = afterStartSequence.slice(0, sliceEnd);
  return res;
}
