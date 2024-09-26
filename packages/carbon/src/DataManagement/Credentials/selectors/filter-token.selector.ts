import { identity } from "ramda";
import {
  CredentialFilterField,
  CredentialSortField,
  DataQuery,
} from "@dashlane/communication";
import { createOptimizedFilterTokenSelector } from "Libs/Query";
export const filterTokenSelector = createOptimizedFilterTokenSelector(
  (
    _state: any,
    { filterToken }: DataQuery<CredentialSortField, CredentialFilterField>
  ) => filterToken,
  identity
);
