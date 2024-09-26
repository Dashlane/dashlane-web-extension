import { createSelector } from "reselect";
import { firstValueFrom, identity } from "rxjs";
import {
  Credential,
  DataQuery,
  GeneratedPassword,
  Page,
  PasswordHistoryFilterField,
  PasswordHistoryFirstTokenParams,
  PasswordHistoryItemType,
  PasswordHistoryItemView,
  PasswordHistorySortField,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import {
  Permission,
  type SharingItemsClient,
} from "@dashlane/sharing-contracts";
import { State } from "Store";
import { generatedPasswordsSelector } from "DataManagement/GeneratedPassword/selectors";
import { credentialsHistoriesSelector } from "DataManagement/ChangeHistory/selectors";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { passwordHistoryItemMatch } from "DataManagement/PasswordHistory/search";
import { PasswordHistoryItem } from "DataManagement/PasswordHistory/types";
import {
  getPasswordHistoryBatch,
  getPasswordHistoryFilterToken,
  getPasswordHistoryFirstToken,
  getPasswordHistorySortToken,
  viewPasswordHistoryBatch,
} from "DataManagement/PasswordHistory/pagination";
import { ChangeHistory } from "DataManagement/ChangeHistory";
import {
  ChangeSet,
  KWAuthentifiantCurrentData,
  KWSecureNoteCurrentData,
} from "DataManagement/ChangeHistory/ChangeSet/types";
import { getPasswordHistoryMappers } from "./mappers";
import { Token } from "Libs/Pagination/types";
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
import { limitedSharingItemsSelector } from "Sharing/2/Services/selectors/limited-sharing-items.selector";
import { iconsSelector } from "DataManagement/Icons/selectors";
import { sendExceptionLog } from "Logs/Exception";
const changeSetContainsAPasswordChange = (changeSet: ChangeSet) => {
  if (!("ChangedProperties" in changeSet)) {
    return false;
  }
  return changeSet.ChangedProperties.some(
    (property) => property.toLowerCase() === "password"
  );
};
const passwordHistoryCombiner = (
  genPwdResults: GeneratedPassword[],
  changeHistoryResults: ChangeHistory[],
  credentialsIndex: Map<string, Credential>,
  limitedSharedItems: {
    [id: string]: boolean;
  }
): PasswordHistoryItem[] => {
  const transformedGeneratedPasswords: PasswordHistoryItem[] = genPwdResults
    .filter((result) => !result.AuthId)
    .map((result) => ({
      type: PasswordHistoryItemType.Generated,
      primaryInfo: result.Domain ?? "",
      secondaryInfo: "",
      domain: result.Domain,
      password: result.Password,
      timestamp: result.GeneratedDate,
      id: result.Id,
      isProtected: false,
    }));
  const isCurrentDataAuthentifiant = (
    data: KWAuthentifiantCurrentData | KWSecureNoteCurrentData | undefined
  ): data is KWAuthentifiantCurrentData => {
    if (!data) {
      return false;
    }
    return (
      ((data as KWAuthentifiantCurrentData).Email !== undefined ||
        (data as KWAuthentifiantCurrentData).Login !== undefined) &&
      (data as KWAuthentifiantCurrentData).Url !== undefined &&
      (data as KWAuthentifiantCurrentData).Password !== undefined
    );
  };
  const transformedChangeHistory: PasswordHistoryItem[] =
    changeHistoryResults.reduce(
      (passwordHistoryItemList, changeHistoryResultsItem) => {
        if (
          limitedSharedItems[changeHistoryResultsItem.ObjectId] ||
          !changeHistoryResultsItem.hasOwnProperty("ChangeSets")
        ) {
          return passwordHistoryItemList;
        }
        const credential = credentialsIndex.get(
          changeHistoryResultsItem.ObjectId
        );
        if (!credential) {
          return passwordHistoryItemList;
        }
        const credentialTitle = credential?.Title;
        const credentialUrl = credential?.Url;
        const credentialEmail = credential?.Email;
        const credentialLogin = credential?.Login;
        const credentialIsProtected = credential?.AutoProtected || false;
        const innerPasswordHistoryItemList: PasswordHistoryItem[] =
          changeHistoryResultsItem.ChangeSets.reduce(
            (innerPasswordHistoryItemListAcc, changeSetItem) => {
              if (
                !changeSetContainsAPasswordChange(changeSetItem) ||
                !isCurrentDataAuthentifiant(changeSetItem.CurrentData)
              ) {
                return innerPasswordHistoryItemListAcc;
              }
              const credentialDomain = new ParsedURL(
                credentialUrl
              ).getRootDomain();
              const innerPasswordHistoryItem = {
                type: PasswordHistoryItemType.Credential,
                primaryInfo: (credentialTitle || credentialDomain) ?? "",
                secondaryInfo: (credentialEmail || credentialLogin) ?? "",
                domain: credentialUrl || changeSetItem.CurrentData.Url,
                password: changeSetItem.CurrentData.Password,
                timestamp: changeSetItem.ModificationDate,
                id: changeSetItem.Id,
                credentialId: credential?.Id,
                isProtected: credentialIsProtected,
                spaceId: credential.SpaceId,
                email: credential?.Email ?? "",
                login: credential?.Login ?? "",
                secondaryLogin: credential?.SecondaryLogin ?? "",
              };
              return innerPasswordHistoryItemListAcc.concat(
                innerPasswordHistoryItem
              );
            },
            []
          );
        return passwordHistoryItemList.concat(innerPasswordHistoryItemList);
      },
      []
    );
  return transformedGeneratedPasswords.concat(transformedChangeHistory);
};
const indexMapper = (credentials: Credential[]): Map<string, Credential> => {
  return credentials.reduce(
    (mapAccumulator, cred) => mapAccumulator.set(cred.Id, cred),
    new Map()
  );
};
const credentialIndexSelector = createSelector(
  credentialsSelector,
  indexMapper
);
export const passwordHistorySelector = createSelector(
  generatedPasswordsSelector,
  credentialsHistoriesSelector,
  credentialIndexSelector,
  limitedSharingItemsSelector,
  passwordHistoryCombiner
);
export type HasPasswordHistorySelector = (
  state: State,
  credentialId: string
) => Promise<boolean>;
export const makeHasPasswordHistorySelector = (
  sharingItemsClient: SharingItemsClient
): HasPasswordHistorySelector => {
  return async (_state, credentialId) => {
    const getPermissionForItemsResult = await firstValueFrom(
      sharingItemsClient.queries.getPermissionForItems({
        itemIds: [credentialId],
      })
    );
    if (isFailure(getPermissionForItemsResult)) {
      sendExceptionLog(
        new Error(
          `Could not retrieve item permission for hasPasswordHistorySelector`
        )
      );
      return false;
    }
    const sharedItemsWithPermission = getSuccess(getPermissionForItemsResult);
    const isSharedWithLimitedRights = (_credentialId: string) =>
      _credentialId in sharedItemsWithPermission &&
      sharedItemsWithPermission[_credentialId] === Permission.Limited;
    const credentialHistories = credentialsHistoriesSelector(_state);
    return credentialHistories.some((entry: ChangeHistory) => {
      return (
        entry.ObjectId === credentialId &&
        !isSharedWithLimitedRights(entry.ObjectId) &&
        entry.ChangeSets.some(changeSetContainsAPasswordChange)
      );
    });
  };
};
export const passwordHistoryMappersSelector = (_state: State) =>
  getPasswordHistoryMappers();
const historyMappers = getPasswordHistoryMappers();
export const getPasswordHistoryMappersSelector = () => historyMappers;
const passwordHistoryItemMatchSelector = () => passwordHistoryItemMatch;
export const passwordHistoryListViewSelector = createSelector(
  iconsSelector,
  passwordHistorySelector,
  (icons) => (passwordHistoryItems: PasswordHistoryItem[]) =>
    viewPasswordHistoryBatch(passwordHistoryItems, icons)
);
export const passwordHistoryPageSelector = (
  state: State,
  tokenString: string
): Page<PasswordHistoryItemView> => {
  const token = parseToken(tokenString);
  const { sortToken, filterToken } = token;
  const mappers = getPasswordHistoryMappers();
  const passwordHistory = passwordHistoryQuerySelector(state, {
    sortToken,
    filterToken,
  });
  const listView = passwordHistoryListViewSelector(state);
  const nextToken = generateNextToken(mappers, token, passwordHistory);
  const prevToken = generatePrevToken(mappers, token, passwordHistory);
  const batch = getBatch(mappers, token, passwordHistory);
  const nextTokenString = stringifyToken(nextToken);
  const prevTokenString = stringifyToken(prevToken);
  const viewedBatch = listView(batch);
  return {
    batch: viewedBatch,
    nextToken: nextTokenString,
    prevToken: prevTokenString,
  };
};
export const passwordHistoryPaginationTokenSelector = (
  state: State,
  params: PasswordHistoryFirstTokenParams
): string => {
  const sortToken = getPasswordHistorySortToken(params);
  const filterToken = getPasswordHistoryFilterToken(params);
  const mappers = getPasswordHistoryMappers();
  const tokens = { sortToken, filterToken };
  const passwordHistory = passwordHistoryQuerySelector(state, tokens);
  const token = getPasswordHistoryFirstToken(
    mappers,
    tokens,
    params,
    passwordHistory
  );
  return stringifyToken(token);
};
const fieldMappersSelector = createSelector(
  passwordHistorySelector,
  getPasswordHistoryMappers
);
const sortTokenSelector = createOptimizedSortTokenSelector(
  (
    _state: any,
    {
      sortToken,
    }: DataQuery<PasswordHistorySortField, PasswordHistoryFilterField>
  ) => sortToken,
  identity
);
const filterTokenSelector = createOptimizedFilterTokenSelector(
  (
    _state: any,
    {
      filterToken,
    }: DataQuery<PasswordHistorySortField, PasswordHistoryFilterField>
  ) => filterToken,
  identity
);
export const passwordHistoryQuerySelector = createSelector(
  getPasswordHistoryMappers,
  passwordHistoryItemMatchSelector,
  sortTokenSelector,
  filterTokenSelector,
  passwordHistorySelector,
  queryData
);
export const getViewedPasswordHistoryBatchSelector = (
  token: Token<PasswordHistorySortField, PasswordHistoryFilterField>
) => {
  const { sortToken, filterToken } = token;
  const _getBatch = getPasswordHistoryBatch(token);
  const batchSelector = createSelector(
    (state) => passwordHistoryQuerySelector(state, { filterToken, sortToken }),
    fieldMappersSelector,
    _getBatch
  );
  const optimizedBatchSelector = optimizeBatchSelector(batchSelector);
  return createSelector(
    optimizedBatchSelector,
    iconsSelector,
    viewPasswordHistoryBatch
  );
};
