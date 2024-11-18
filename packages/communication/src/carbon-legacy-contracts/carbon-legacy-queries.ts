import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { carbonLiveQueriesSlots, carbonQueriesSlots } from "../CarbonApi";
import { createQueryContractsFromConnectors } from "./ts-event-bus-adapter";
import { CarbonStateListQueryParam, CarbonStateQueryParam } from "./types";
export class CarbonStateQuery extends defineQuery<
  unknown,
  never,
  CarbonStateQueryParam
>({
  scope: UseCaseScope.Device,
  useCache: true,
}) {}
export class CarbonStateListQuery extends defineQuery<
  unknown[],
  never,
  CarbonStateListQueryParam
>({
  scope: UseCaseScope.Device,
  useCache: true,
}) {}
export const queriesFromCarbonAPI = createQueryContractsFromConnectors(
  carbonQueriesSlots,
  carbonLiveQueriesSlots
);
export const queries = {
  ...queriesFromCarbonAPI,
  CarbonStateQuery,
  CarbonStateListQuery,
};
