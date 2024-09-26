import { curry } from "ramda";
export const binaryContains = curry(function binaryContains<T>(
  list: T[],
  element: T
): boolean {
  const len = list.length;
  if (len === 0) {
    return false;
  }
  const ix = Math.floor(len / 2);
  const el = list[ix];
  if (el === element) {
    return true;
  } else if (el < element) {
    const nextList = list.slice(ix + 1, len);
    return binaryContains(nextList, element);
  } else {
    const prevList = list.slice(0, ix);
    return binaryContains(prevList, element);
  }
});
export function binaryFindIndex<T>(
  list: T[],
  predicate: (t: T) => boolean,
  startIndex?: number
): number {
  const len = list.length;
  if (len === 0) {
    return -1;
  }
  const ix = startIndex ? Math.min(startIndex, len - 1) : Math.floor(len / 2);
  const el = list[ix];
  if (predicate(el)) {
    const prevList = list.slice(0, ix);
    const prevlistFirstIndex = binaryFindIndex(prevList, predicate);
    return prevlistFirstIndex === -1 ? ix : prevlistFirstIndex;
  } else {
    const nextList = list.slice(ix + 1, len);
    const nextListFirstIndex = binaryFindIndex(nextList, predicate);
    return nextListFirstIndex === -1 ? -1 : ix + nextListFirstIndex + 1;
  }
}
export function binaryFindLastIndex<T>(
  list: T[],
  predicate: (t: T) => boolean,
  startIndex?: number
): number {
  const len = list.length;
  if (len === 0) {
    return -1;
  }
  const ix = startIndex ? Math.min(startIndex, len - 1) : Math.floor(len / 2);
  const el = list[ix];
  if (predicate(el)) {
    const nextList = list.slice(ix + 1, len);
    const nextListLastIndex = binaryFindLastIndex(nextList, predicate);
    return nextListLastIndex === -1 ? ix : ix + nextListLastIndex + 1;
  } else {
    const prevList = list.slice(0, ix);
    const prevListLastIndex = binaryFindLastIndex(prevList, predicate);
    return prevListLastIndex;
  }
}
