import { createContext, ReactNode, useContext, useState } from "react";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  SecureNote,
  SortDirection,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { OrderDir } from "../../../libs/sortHelper";
import { useTeamSpaceContext } from "../../../team/settings/components/TeamSpaceContext";
import { SortingOptions } from "../../list-view/types";
import { useSortingOptions } from "../../credentials/credentials-view/use-sorting-options";
import { SECURE_NOTES_LIST_PREFERENCES } from "../../../libs/localstorage-constants";
import { PreviousPage } from "../../routes";
interface Context {
  secureNotes: SecureNote[];
  hasMore: boolean;
  onNextPage: (nextPageNumber: number) => void;
  setSortOrder: (newSortingOptions: SortingOptions) => void;
  sortingOptions: SortingOptions;
  status: DataStatus;
  previousPage?: PreviousPage;
}
const SecureNotesContext = createContext<Context>({} as Context);
interface Provider {
  children: ReactNode;
  ids?: string[];
  previousPage?: PreviousPage;
}
const PAGE_SIZE = 20;
const SecureNotesProvider = ({ children, ids, previousPage }: Provider) => {
  const { currentSpaceId } = useTeamSpaceContext();
  const { setSortOrder, sortingOptions } = useSortingOptions(
    SECURE_NOTES_LIST_PREFERENCES
  );
  const [pageNumber, setPageNumber] = useState(1);
  const { data, status } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.SecureNote],
    pageNumber: 1,
    pageSize: PAGE_SIZE * pageNumber,
    ids: ids,
    propertyFilters:
      currentSpaceId !== null
        ? [
            {
              property: "spaceId",
              value: currentSpaceId,
            },
          ]
        : undefined,
    propertySorting: {
      property: sortingOptions.field,
      direction:
        sortingOptions.direction === OrderDir.ascending
          ? SortDirection.Ascend
          : SortDirection.Descend,
    },
  });
  const contextValue = {
    secureNotes: data?.secureNotesResult.items ?? [],
    hasMore:
      !data ||
      data.secureNotesResult.items.length < data.secureNotesResult.matchCount,
    onNextPage: setPageNumber,
    setSortOrder,
    sortingOptions,
    status,
    previousPage,
  };
  return (
    <SecureNotesContext.Provider value={contextValue}>
      {children}
    </SecureNotesContext.Provider>
  );
};
const useSecureNotesContext = () => useContext(SecureNotesContext);
export { SecureNotesProvider, useSecureNotesContext };
