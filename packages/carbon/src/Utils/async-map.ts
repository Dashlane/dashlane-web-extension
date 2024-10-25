export const asyncMap = <T, U>(
  items: T[],
  callback: (t: T) => Promise<U>
): Promise<U[]> => Promise.all(items.map((item) => callback(item)));
