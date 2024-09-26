export async function asyncFilter<E>(
  array: E[],
  handler: (e: E) => Promise<boolean>
): Promise<E[]> {
  const results = await Promise.all(array.map(handler));
  return array.filter((_e: E, i: number) => results[i]);
}
