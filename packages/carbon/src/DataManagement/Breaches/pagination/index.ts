import { curry } from "ramda";
import {
  BreachesFilterField,
  BreachesFilterToken,
  BreachesFirstTokenParams,
  BreachesQuery,
  BreachesSortField,
  BreachesSortToken,
  BreachItemView,
} from "@dashlane/communication";
import { generateFirstToken, getBatch } from "Libs/Pagination";
import { Token } from "Libs/Pagination/types";
import { Breach, BreachMappers } from "DataManagement/Breaches/types";
import { listView } from "DataManagement/Breaches/Views/views";
import { IconDomains } from "Session/Store/Icons";
const DEFAULT_BATCH_SIZE = 30;
export const getBreachesFilterToken = ({
  filterCriteria,
}: BreachesFirstTokenParams): BreachesFilterToken => ({
  filterCriteria: filterCriteria || [],
});
export const getBreacheSortToken = ({
  sortCriteria,
}: BreachesFirstTokenParams): BreachesSortToken => ({
  uniqField: "id",
  sortCriteria: sortCriteria || [],
});
export const getBreachesFirstToken = (
  mappers: BreachMappers,
  tokens: BreachesQuery,
  params: BreachesFirstTokenParams,
  sortedBreaches: Breach[]
): Token<BreachesSortField, BreachesFilterField> =>
  generateFirstToken(
    mappers,
    tokens,
    params.initialBatchSize || DEFAULT_BATCH_SIZE,
    sortedBreaches
  );
export const viewBreachesBatch = (
  icons: IconDomains,
  batch: Breach[]
): BreachItemView[] => listView(icons, batch);
export const getBreachesBatch = curry(
  (
    token: Token<BreachesSortField, BreachesFilterField>,
    breaches: Breach[],
    mappers: BreachMappers
  ): Breach[] => getBatch(mappers, token, breaches)
);
