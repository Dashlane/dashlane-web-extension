import { compose } from "ramda";
import {
  DataQuery,
  GeneratedPassword,
  GeneratedPasswordFirstTokenParams,
  GeneratedPasswordItemView,
  GeneratedPasswordsFilterField,
  GeneratedPasswordsSortField,
  Page,
} from "@dashlane/communication";
import { viewListResults } from "DataManagement/Search/views";
import { itemView, listView } from "DataManagement/GeneratedPassword/views";
import { State } from "Store";
import { getQuerySelector } from "DataManagement/query-selector";
import { generatedPasswordMatch } from "DataManagement/GeneratedPassword/search";
import { getGeneratedPasswordMappers } from "DataManagement/GeneratedPassword/mappers";
import {
  getGeneratedPasswordsFilterToken,
  getGeneratedPasswordsFirstToken,
  getGeneratedPasswordsSortToken,
  viewGeneratedPasswordsBatch,
} from "DataManagement/GeneratedPassword/pagination";
import { createSelector } from "reselect";
import {
  createOptimizedFilterTokenSelector,
  createOptimizedSortTokenSelector,
  parseToken,
  queryData,
  stringifyToken,
} from "Libs/Query";
import { identity } from "rxjs";
import {
  generateNextToken,
  generatePrevToken,
  getBatch,
} from "Libs/Pagination";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
const unsafeAllGeneratedPasswordsSelector = (
  state: State
): GeneratedPassword[] => state.userSession.personalData.generatedPasswords;
export const countAllGeneratedPasswordsSelector = (state: State): number =>
  state.userSession.personalData.generatedPasswords.length;
export const generatedPasswordsSelector = createSelector(
  [unsafeAllGeneratedPasswordsSelector, quarantinedSpacesSelector],
  filterOutQuarantinedItems
);
export const generatedPasswordSelector = (
  state: State,
  generatedPasswordId: string
): GeneratedPassword | undefined => {
  const generatedPasswords = generatedPasswordsSelector(state);
  return findDataModelObject(generatedPasswordId, generatedPasswords);
};
export const viewedGeneratedPasswordSelector = (
  state: State,
  generatedPasswordId: string
): GeneratedPasswordItemView | undefined => {
  const generatedPassword = generatedPasswordSelector(
    state,
    generatedPasswordId
  );
  return itemView(generatedPassword);
};
export const generatedPasswordMappersSelector = (_state: State) =>
  getGeneratedPasswordMappers();
const generatedPasswordMatchSelector = () => generatedPasswordMatch;
const passwordMappers = getGeneratedPasswordMappers();
export const getGeneratedPasswordMappersSelector = () => {
  return passwordMappers;
};
export const queryGeneratedPasswordsSelector = getQuerySelector(
  generatedPasswordsSelector,
  generatedPasswordMatchSelector,
  generatedPasswordMappersSelector
);
export const viewedQueriedGeneratedPasswordsSelector = compose(
  viewListResults(listView),
  queryGeneratedPasswordsSelector
);
export const getLiveGeneratedPasswordsSelector = makeLiveSelectorGetter(
  generatedPasswordsSelector,
  () => listView,
  generatedPasswordMatchSelector,
  getGeneratedPasswordMappersSelector
);
export const generatedPasswordsPageSelector = (
  state: State,
  tokenString: string
): Page<GeneratedPasswordItemView> => {
  const token = parseToken(tokenString);
  const { sortToken, filterToken } = token;
  const tokens = { sortToken, filterToken };
  const mappers = getGeneratedPasswordMappers();
  const generatedPasswords = generatedPasswordsQuerySelector(state, tokens);
  const nextToken = generateNextToken(mappers, token, generatedPasswords);
  const prevToken = generatePrevToken(mappers, token, generatedPasswords);
  const batch = getBatch(mappers, token, generatedPasswords);
  const nextTokenString = stringifyToken(nextToken);
  const prevTokenString = stringifyToken(prevToken);
  const viewedBatch = viewGeneratedPasswordsBatch(batch);
  return {
    batch: viewedBatch,
    nextToken: nextTokenString,
    prevToken: prevTokenString,
  };
};
export const generatedPasswordsPaginationTokenSelector = (
  state: State,
  params: GeneratedPasswordFirstTokenParams
): string => {
  const sortToken = getGeneratedPasswordsSortToken(params);
  const filterToken = getGeneratedPasswordsFilterToken(params);
  const mappers = getGeneratedPasswordMappers();
  const tokens = { sortToken, filterToken };
  const generatedPasswords = generatedPasswordsQuerySelector(state, tokens);
  const token = getGeneratedPasswordsFirstToken(
    mappers,
    tokens,
    params,
    generatedPasswords
  );
  const stringified = stringifyToken(token);
  return stringified;
};
const sortTokenSelector = createOptimizedSortTokenSelector(
  (
    _state: any,
    {
      sortToken,
    }: DataQuery<GeneratedPasswordsSortField, GeneratedPasswordsFilterField>
  ) => sortToken,
  identity
);
const filterTokenSelector = createOptimizedFilterTokenSelector(
  (
    _state: any,
    {
      filterToken,
    }: DataQuery<GeneratedPasswordsSortField, GeneratedPasswordsFilterField>
  ) => filterToken,
  identity
);
export const generatedPasswordsQuerySelector = createSelector(
  getGeneratedPasswordMappers,
  generatedPasswordMatchSelector,
  sortTokenSelector,
  filterTokenSelector,
  generatedPasswordsSelector,
  queryData
);
