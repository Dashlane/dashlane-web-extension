import { identity } from "rxjs";
import { createSelector } from "reselect";
import {
  BreachDetailItemView,
  BreachesDataQuery,
  BreachesFilterField,
  BreachesFirstTokenParams,
  BreachesSortField,
  BreachesUpdaterStatus,
  BreachItemView,
  DataQuery,
  ListResults,
  Page,
} from "@dashlane/communication";
import { State } from "Store";
import { Breach, VersionedBreach } from "DataManagement/Breaches/types";
import { isSupportedBreach } from "DataManagement/Breaches/guards";
import { Token } from "Libs/Pagination/types";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { viewListResults } from "DataManagement/Search/views";
import { getQuerySelector } from "DataManagement/query-selector";
import {
  createOptimizedFilterTokenSelector,
  createOptimizedSortTokenSelector,
  optimizeBatchSelector,
  parseToken,
  queryData,
  stringifyToken,
} from "Libs/Query";
import {
  generateNextToken,
  generatePrevToken,
  getBatch,
} from "Libs/Pagination";
import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { detailItemView } from "DataManagement/Breaches/Views/views";
import { getBreachMappers } from "DataManagement/Breaches/mappers";
import { breachMatch } from "DataManagement/Breaches/search";
import {
  getBreachesBatch,
  getBreachesFilterToken,
  getBreachesFirstToken,
  getBreacheSortToken,
  viewBreachesBatch,
} from "DataManagement/Breaches/pagination";
import { iconsSelector } from "DataManagement/Icons/selectors";
const allBreachesSelector = (state: State): VersionedBreach[] =>
  state.userSession.personalData.securityBreaches;
const supportedBreachesSelector = createSelector(
  allBreachesSelector,
  (breaches: VersionedBreach[]) => breaches.filter(isSupportedBreach)
);
export const breachesSelector = createSelector(
  supportedBreachesSelector,
  (breaches: Breach[]) => {
    const breachGroups = breaches
      .reduce((acc, breach) => {
        const existingById = acc.get(breach.BreachId);
        if (
          !existingById ||
          existingById.LastBackupTime < breach.LastBackupTime
        ) {
          acc.set(breach.BreachId, breach);
        }
        return acc;
      }, new Map<string, Breach>())
      .values();
    return [...breachGroups];
  }
);
export const publicBreachesRevisionSelector = (state: State): number =>
  state.userSession.personalData.securityBreachesMetadata
    .latestPublicBreachesRevision;
export const privateBreachesLastUpdateTimestamp = (state: State): number =>
  state.userSession.personalData.securityBreachesMetadata
    .latestDataLeaksBreachesUpdate;
export function breachSelector(state: State, id: string): Breach | undefined {
  const breaches = breachesSelector(state);
  return findDataModelObject(id, breaches);
}
export function viewedBreachSelector(
  state: State,
  id: string
): BreachDetailItemView | undefined {
  const icons = iconsSelector(state);
  const breach = breachSelector(state, id);
  return detailItemView(icons, breach);
}
export const breachMappersSelector = (_state: State) => getBreachMappers();
const breachMatchSelector = () => breachMatch;
const queryBreachesSelector = getQuerySelector(
  breachesSelector,
  breachMatchSelector,
  breachMappersSelector
);
const breachListViewSelector = createSelector(
  iconsSelector,
  (icons) => (breaches: Breach[]) => viewBreachesBatch(icons, breaches)
);
export const viewedQueriedBreachesSelector = (
  state: State,
  query: BreachesDataQuery
): ListResults<BreachItemView> => {
  const queryResults = queryBreachesSelector(state, query);
  const listView = breachListViewSelector(state);
  return viewListResults(listView)(queryResults);
};
export function breachesPageSelector(
  state: State,
  tokenString: string
): Page<BreachItemView> {
  const token = parseToken(tokenString);
  const { sortToken, filterToken } = token;
  const tokens = { sortToken, filterToken };
  const mappers = getBreachMappers();
  const breaches = breachesQuerySelector(state, tokens);
  const listView = breachListViewSelector(state);
  const nextToken = generateNextToken(mappers, token, breaches);
  const prevToken = generatePrevToken(mappers, token, breaches);
  const batch = getBatch(mappers, token, breaches);
  const nextTokenString = stringifyToken(nextToken);
  const prevTokenString = stringifyToken(prevToken);
  const viewedBatch = listView(batch);
  return {
    batch: viewedBatch,
    nextToken: nextTokenString,
    prevToken: prevTokenString,
  };
}
export const breachesPaginationTokenSelector = (
  state: State,
  params: BreachesFirstTokenParams
): string => {
  const sortToken = getBreacheSortToken(params);
  const filterToken = getBreachesFilterToken(params);
  const mappers = getBreachMappers();
  const tokens = { sortToken, filterToken };
  const breaches = breachesQuerySelector(state, tokens);
  const token = getBreachesFirstToken(mappers, tokens, params, breaches);
  const stringified = stringifyToken(token);
  return stringified;
};
const sortTokenSelector = createOptimizedSortTokenSelector(
  (
    _state: any,
    { sortToken }: DataQuery<BreachesSortField, BreachesFilterField>
  ) => sortToken,
  identity
);
const filterTokenSelector = createOptimizedFilterTokenSelector(
  (
    _state: any,
    { filterToken }: DataQuery<BreachesSortField, BreachesFilterField>
  ) => filterToken,
  identity
);
export const breachesQuerySelector = createSelector(
  getBreachMappers,
  breachMatchSelector,
  sortTokenSelector,
  filterTokenSelector,
  breachesSelector,
  queryData
);
export const fieldMappersSelector = createSelector(
  breachesSelector,
  getBreachMappers
);
export const getLiveBreachesSelector = makeLiveSelectorGetter(
  breachesSelector,
  breachListViewSelector,
  breachMatchSelector,
  breachMappersSelector
);
export const getViewedBreachesBatchSelector = (
  token: Token<BreachesSortField, BreachesFilterField>
) => {
  const { sortToken, filterToken } = token;
  const tokens = { sortToken, filterToken };
  const getBatch = getBreachesBatch(token);
  const batchSelector = createSelector(
    (state) => breachesQuerySelector(state, tokens),
    fieldMappersSelector,
    getBatch
  );
  const optimizedBatchSelector = optimizeBatchSelector(batchSelector);
  return createSelector(
    iconsSelector,
    optimizedBatchSelector,
    viewBreachesBatch
  );
};
export function getViewedBreachSelector(id: string) {
  const breachSelector = createSelector(breachesSelector, (breaches) =>
    findDataModelObject(id, breaches)
  );
  return createSelector(iconsSelector, breachSelector, detailItemView);
}
export const breachesUpdaterStatusSelector = (
  state: State
): BreachesUpdaterStatus =>
  state.userSession.personalData.breachesUpdaterStatus;
export const lastBreachRefreshTimestampSelector = (state: State): number =>
  state.userSession.breachRefreshMetaData.lastBreachRefreshTimestamp;
