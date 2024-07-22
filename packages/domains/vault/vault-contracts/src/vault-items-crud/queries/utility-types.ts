import { VaultItem } from "../types";
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
export type VaultItemPropertyKey = keyof UnionToIntersection<VaultItem>;
