import { MergeResult } from "DataManagement/DeDuplication/types";
export const strictEqual = <T>(a: T, b: T): MergeResult<T> =>
  a === b
    ? {
        success: true,
        result: a,
      }
    : {
        success: false,
      };
export const boolEqual = <T>(a: T, b: T): MergeResult<T> =>
  Boolean(a) === Boolean(b)
    ? {
        success: true,
        result: a,
      }
    : {
        success: false,
      };
export const genericMerge = <T>(
  a: Exclude<T, boolean>,
  b: Exclude<T, boolean>
): MergeResult<T> => {
  if (a === b) {
    return {
      success: true,
      result: a,
    };
  } else if (!a || !b) {
    return {
      success: true,
      result: a || b,
    };
  } else {
    return { success: false };
  }
};
const numberMerge =
  <T extends number | undefined>(handler: (a: number, b: number) => number) =>
  (a: T, b: T): MergeResult<number | undefined> => ({
    success: true,
    result:
      a === undefined && b === undefined ? undefined : handler(a ?? 0, b ?? 0),
  });
export const sumMerge = numberMerge((a: number, b: number) => a + b);
export const maxMerge = numberMerge(Math.max);
export const minMerge = numberMerge(Math.min);
export const concatMerge = <T>(
  a: T[] | undefined,
  b: T[] | undefined
): MergeResult<Array<T>> => ({
  success: true,
  result:
    a === undefined && b === undefined
      ? undefined
      : [...(a ?? []), ...(b ?? [])],
});
