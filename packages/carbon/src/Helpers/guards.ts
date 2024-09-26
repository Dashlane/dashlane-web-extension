export function assertType<T, U extends T>(obj: T, guard: (x: T) => x is U): U {
  if (!guard(obj)) {
    throw new Error("guard failed !");
  }
  return obj;
}
