import { identity } from "ramda";
import {
  CredentialFilterField,
  CredentialSortField,
  DataQuery,
} from "@dashlane/communication";
import { createOptimizedSortTokenSelector } from "Libs/Query";
export const sortTokenSelector = createOptimizedSortTokenSelector(
  (
    _state: any,
    { sortToken }: DataQuery<CredentialSortField, CredentialFilterField>
  ) => sortToken,
  identity
);
