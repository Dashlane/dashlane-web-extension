export function isNotUndefined<T>(arg: T | undefined): arg is T {
  return arg !== undefined;
}
