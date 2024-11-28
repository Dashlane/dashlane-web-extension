import { useState } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { jsx } from "@dashlane/design-system";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  SortDirection,
  VaultItemType,
  vaultSearchApi,
} from "@dashlane/vault-contracts";
import { Website } from "../../../../../store/types";
import SearchEventLogger from "../../../search-event-logger";
import { useSearchContext } from "../../../search-field/search-context";
import { VaultTabType } from "../../../types";
import {
  BaseListContainer,
  ISearchOrderProps,
  withSearchOrder,
} from "../common";
import { CredentialsList } from "./credentials-list";
interface CredentialListContainerProps extends ISearchOrderProps {
  website: Website;
}
const PAGE_SIZE = 20;
const CredentialListContainer = ({
  order,
  onOrderChangeHandler,
  website,
}: CredentialListContainerProps) => {
  const { searchValue } = useSearchContext();
  const [pageNumber, setPageNumber] = useState(1);
  const amountToFetch = PAGE_SIZE * pageNumber;
  const { status, data } = useModuleQuery(vaultSearchApi, "search", {
    searchQuery: searchValue,
    vaultItemTypes: [VaultItemType.Credential],
    pageNumber: 1,
    pageSize: amountToFetch,
    propertySorting: {
      property: order === "name" ? "itemName" : "lastUse",
      direction:
        order === "name" ? SortDirection.Ascend : SortDirection.Descend,
    },
  });
  if (status !== DataStatus.Success) {
    return null;
  }
  const { items, matchCount } = data.credentialsResult;
  SearchEventLogger.totalCount = matchCount;
  const hasMore = items.length < matchCount;
  return (
    <BaseListContainer
      hasItems={Boolean(matchCount)}
      vaultTabType={VaultTabType.Credentials}
    >
      <CredentialsList
        credentials={items}
        credentialsCount={matchCount}
        hasMore={hasMore}
        isNextPageLoading={items.length !== amountToFetch && hasMore}
        onLoadMore={() => setPageNumber((prevPageNumber) => prevPageNumber + 1)}
        onOrderChange={(newOrder) => {
          onOrderChangeHandler(newOrder);
          setPageNumber(1);
        }}
        order={order}
        website={website}
      />
    </BaseListContainer>
  );
};
export default withSearchOrder(CredentialListContainer);
