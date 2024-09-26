import {
  GeneratedPassword,
  GeneratedPasswordFilterToken,
  GeneratedPasswordFirstTokenParams,
  GeneratedPasswordItemView,
  GeneratedPasswordsDataQuery,
  GeneratedPasswordsFilterField,
  GeneratedPasswordSortToken,
  GeneratedPasswordsSortField,
} from "@dashlane/communication";
import { generateFirstToken } from "Libs/Pagination";
import { Token } from "Libs/Pagination/types";
import { listView } from "DataManagement/GeneratedPassword/views";
import { GeneratedPasswordMappers } from "DataManagement/GeneratedPassword/types";
export const getGeneratedPasswordsFilterToken = ({
  filterCriteria,
}: GeneratedPasswordFirstTokenParams): GeneratedPasswordFilterToken => ({
  filterCriteria: filterCriteria || [],
});
export const getGeneratedPasswordsSortToken = ({
  sortCriteria,
}: GeneratedPasswordFirstTokenParams): GeneratedPasswordSortToken => ({
  uniqField: "id",
  sortCriteria: sortCriteria || [],
});
export const getGeneratedPasswordsFirstToken = (
  mappers: GeneratedPasswordMappers,
  tokens: GeneratedPasswordsDataQuery,
  params: GeneratedPasswordFirstTokenParams,
  sortedGeneratedPasswords: GeneratedPassword[]
): Token<GeneratedPasswordsSortField, GeneratedPasswordsFilterField> =>
  generateFirstToken(
    mappers,
    tokens,
    params.initialBatchSize || 30,
    sortedGeneratedPasswords
  );
export const viewGeneratedPasswordsBatch = (
  batch: GeneratedPassword[]
): GeneratedPasswordItemView[] => {
  const view = listView(batch);
  return view;
};
