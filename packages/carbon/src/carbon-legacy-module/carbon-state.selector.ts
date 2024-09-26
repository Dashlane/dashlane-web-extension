const isRecord = <TKey extends string>(
  x: unknown,
  k: TKey
): x is {
  [k in TKey]: unknown | null | undefined;
} => {
  return typeof x === "object" && !!x && k in x;
};
export const getCarbonLegacyStateSelector = (
  state: unknown,
  path: string
): unknown => {
  if (!path) {
    return state;
  }
  return path.split(".").reduce((value, property) => {
    if (isRecord(value, property)) {
      return value[property];
    }
    return value;
  }, state);
};
