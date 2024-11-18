import { usePaginatedEndpoint } from "@dashlane/carbon-api-consumers";
import {
  CredentialFilterField,
  CredentialSearchOrder,
  CredentialsFirstTokenParams,
  CredentialSortField,
  FilterCriterium,
  SortCriterium,
} from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
const mapSearchOrderToSortCriterium = (
  searchOrder: CredentialSearchOrder
): SortCriterium<CredentialSortField> => {
  switch (searchOrder) {
    case CredentialSearchOrder.DATE:
      return {
        field: "lastUse",
        direction: "descend",
      };
    case CredentialSearchOrder.NAME:
      return {
        field: "title",
        direction: "ascend",
      };
  }
};
export const useCredentialsPaginatedEndpoint = (
  searchValue: string,
  sortValue: CredentialSearchOrder
) => {
  const filterCriteria: FilterCriterium<CredentialFilterField>[] = [];
  if (searchValue !== "") {
    filterCriteria.push({
      type: "matches",
      value: searchValue,
    });
  }
  const tokenQueryParam: CredentialsFirstTokenParams = {
    sortCriteria: [mapSearchOrderToSortCriterium(sortValue)],
    filterCriteria,
    initialBatchSize: 20,
  };
  return usePaginatedEndpoint(
    {
      batchLiveEndpoint: carbonConnector.liveCredentialsBatch,
      pageEndpoint: carbonConnector.getCredentialsPage,
      tokenEndpoint: carbonConnector.getCredentialsPaginationToken,
      tokenEndpointParam: tokenQueryParam,
    },
    [searchValue, sortValue]
  );
};
