import { useState } from "react";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { jsx } from "@dashlane/ui-components";
import {
  SortDirection,
  VaultItemType,
  vaultSearchApi,
} from "@dashlane/vault-contracts";
import SearchEventLogger from "../../../search-event-logger";
import { useSearchContext } from "../../../search-field/search-context";
import { VaultTabType } from "../../../types";
import {
  BaseListContainer,
  ISearchOrderProps,
  withSearchOrder,
} from "../common";
import { SecureNotesList } from "./secure-notes-list";
const PAGE_SIZE = 20;
const SecureNotesListContainer = ({
  order,
  onOrderChangeHandler,
}: ISearchOrderProps) => {
  const { searchValue } = useSearchContext();
  const [pageNumber, setPageNumber] = useState(1);
  const amountToFetch = PAGE_SIZE * pageNumber;
  const { status, data } = useModuleQuery(vaultSearchApi, "search", {
    searchQuery: searchValue,
    vaultItemTypes: [VaultItemType.SecureNote],
    pageNumber: 1,
    pageSize: amountToFetch,
    propertySorting: {
      property: order === "name" ? "title" : "lastUse",
      direction: SortDirection.Ascend,
    },
  });
  if (status !== DataStatus.Success) {
    return null;
  }
  const {
    secureNotesResult: { items, matchCount },
  } = data;
  SearchEventLogger.totalCount = matchCount;
  const hasMore = items.length < matchCount;
  return (
    <BaseListContainer
      hasItems={!!items.length}
      vaultTabType={VaultTabType.SecureNotes}
    >
      <SecureNotesList
        notes={items}
        notesCount={matchCount}
        hasMore={hasMore}
        isNextPageLoading={items.length !== amountToFetch && hasMore}
        onLoadMore={() => setPageNumber((prevPageNumber) => prevPageNumber + 1)}
        onOrderChange={(newOrder) => {
          onOrderChangeHandler(newOrder);
          setPageNumber(1);
        }}
        order={order}
      />
    </BaseListContainer>
  );
};
export default withSearchOrder(SecureNotesListContainer);
