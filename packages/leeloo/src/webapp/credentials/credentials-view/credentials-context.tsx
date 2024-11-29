import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { DataStatus, useModuleQueries } from "@dashlane/framework-react";
import {
  Credential,
  SortDirection,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { OrderDir } from "../../../libs/sortHelper";
import { useTeamSpaceContext } from "../../../team/settings/components/TeamSpaceContext";
import { SortingOptions } from "../../list-view/types";
import { useSortingOptions } from "./use-sorting-options";
import { PreviousPage } from "../../routes";
interface Context {
  credentials: Credential[];
  credentialIds: string[];
  isCredentialsGloballyProtected: boolean;
  hasMore: boolean;
  onNextPage: (nextPageNumber: number) => void;
  setSortOrder: (newSortingOptions: SortingOptions) => void;
  sortingOptions: SortingOptions;
  credentialStatus: DataStatus;
  previousPage?: PreviousPage;
}
const CredentialsContext = createContext<Context>({} as Context);
interface Provider {
  children: ReactNode;
  ids?: string[];
  previousPage?: PreviousPage;
}
const PAGE_SIZE = 50;
const CredentialsProvider = ({ children, ids, previousPage }: Provider) => {
  const { currentSpaceId } = useTeamSpaceContext();
  const { setSortOrder, sortingOptions } = useSortingOptions();
  const [pageNumber, setPageNumber] = useState(1);
  const {
    credentialsGloballyProtected: isCredentialsGloballyProtected,
    query: { data, status: credentialStatus },
  } = useModuleQueries(
    vaultItemsCrudApi,
    {
      query: {
        queryParam: {
          vaultItemTypes: [VaultItemType.Credential],
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
            property:
              sortingOptions.field === "title"
                ? "itemName"
                : sortingOptions.field,
            direction:
              sortingOptions.direction === OrderDir.ascending
                ? SortDirection.Ascend
                : SortDirection.Descend,
          },
        },
      },
      credentialsGloballyProtected: {},
    },
    [ids, pageNumber, sortingOptions, currentSpaceId]
  );
  const credentialIds = useMemo(
    () => data?.credentialsResult.items.map((item) => item.id) ?? [],
    [data?.credentialsResult.items]
  );
  const contextValue = useMemo(() => {
    return {
      credentials: data?.credentialsResult.items ?? [],
      credentialIds: credentialIds ?? [],
      isCredentialsGloballyProtected:
        isCredentialsGloballyProtected.data ?? true,
      hasMore:
        !data ||
        data.credentialsResult.items.length < data.credentialsResult.matchCount,
      onNextPage: setPageNumber,
      setSortOrder,
      sortingOptions,
      credentialStatus,
      previousPage,
    };
  }, [
    credentialIds,
    credentialStatus,
    data,
    isCredentialsGloballyProtected.data,
    previousPage,
    setSortOrder,
    sortingOptions,
  ]);
  return (
    <CredentialsContext.Provider value={contextValue}>
      {children}
    </CredentialsContext.Provider>
  );
};
const useCredentialsContext = (): Context => {
  const context = useContext(CredentialsContext);
  if (!context) {
    throw new Error(
      "useCredentialsContext must be used within a CredentialsProvider"
    );
  }
  return context;
};
export { CredentialsProvider, useCredentialsContext };
