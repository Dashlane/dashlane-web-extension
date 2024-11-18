import { equals } from "ramda";
export function sameBatch<D>(b1: D[], b2: D[]): boolean {
  return b1.length === b2.length && b1.every((v1, ix) => equals(b2[ix], v1));
}
