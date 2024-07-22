import { VaultItemPropertyKey } from "./utility-types";
export enum FilterOperators {
  Equal = "equal",
  LessThan = "lessThan",
  GreaterThan = "greaterThan",
}
export type VaultItemPropertyFilter = {
  property: VaultItemPropertyKey;
  value: string;
  operator?: FilterOperators;
};
