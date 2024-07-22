export function isTypeArray<T>(
  uut: unknown,
  requiredProperties: (keyof T)[]
): uut is T[] {
  if (!Array.isArray(uut)) {
    return false;
  }
  if (uut.length === 0) {
    return true;
  }
  const item = uut[0] as Partial<T>;
  for (let index = 0; index < requiredProperties.length; index++) {
    const property = requiredProperties[index];
    if (!Object.prototype.hasOwnProperty.call(item, property)) {
      return false;
    }
  }
  return true;
}
