import { VaultItemPropertyKey } from "./utility-types";
export enum SortDirection {
  Ascend = "ascend",
  Descend = "descend",
}
export type VaultItemPropertySorting = {
  property: VaultItemPropertyKey;
  direction?: SortDirection;
};
