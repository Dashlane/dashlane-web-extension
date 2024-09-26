import {
  PasswordHistoryDataQuery,
  PasswordHistoryFilterField,
  PasswordHistoryFilterToken,
  PasswordHistoryFirstTokenParams,
  PasswordHistoryItemView,
  PasswordHistorySortField,
  PasswordHistorySortToken,
} from "@dashlane/communication";
import { generateFirstToken, getBatch } from "Libs/Pagination";
import { Token } from "Libs/Pagination/types";
import { listView } from "DataManagement/PasswordHistory/views";
import {
  PasswordHistoryItem,
  PasswordHistoryMappers,
} from "DataManagement/PasswordHistory/types";
import { curry } from "ramda";
import { getIcon } from "DataManagement/Icons/get-icons";
import { IconDomains } from "Session/Store/Icons";
export const getPasswordHistoryFilterToken = ({
  filterCriteria,
}: PasswordHistoryFirstTokenParams): PasswordHistoryFilterToken => ({
  filterCriteria: filterCriteria || [],
});
export const getPasswordHistorySortToken = ({
  sortCriteria,
}: PasswordHistoryFirstTokenParams): PasswordHistorySortToken => ({
  uniqField: "id",
  sortCriteria: sortCriteria || [],
});
export const getPasswordHistoryFirstToken = (
  mappers: PasswordHistoryMappers,
  tokens: PasswordHistoryDataQuery,
  params: PasswordHistoryFirstTokenParams,
  sortedPasswordHistory: PasswordHistoryItem[]
): Token<PasswordHistorySortField, PasswordHistoryFilterField> =>
  generateFirstToken(
    mappers,
    tokens,
    params.initialBatchSize || 30,
    sortedPasswordHistory
  );
export const viewPasswordHistoryBatch = (
  batch: PasswordHistoryItem[],
  icons: IconDomains
): PasswordHistoryItemView[] => {
  const getIconById = getIcon(icons);
  return listView(getIconById, batch);
};
export const getPasswordHistoryBatch = curry(
  (
    token: Token<PasswordHistorySortField, PasswordHistoryFilterField>,
    passwordHistory: PasswordHistoryItem[],
    mappers: PasswordHistoryMappers
  ): PasswordHistoryItem[] => getBatch(mappers, token, passwordHistory)
);
