import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { LocalAccountsQueryResult } from "../types";
export class LocalAccountsQuery extends defineQuery<LocalAccountsQueryResult>({
  scope: UseCaseScope.Device,
}) {}
