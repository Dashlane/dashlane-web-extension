import { jsx } from "@dashlane/ui-components";
import { useSearchContext } from "../../../../search-field/search-context";
import { VaultTabType } from "../../../../types";
import { NoResultsVaultItemsList } from "./no-results-vault-items-list/no-results-vault-items-list";
import { EmptyVaultItemsList } from "./empty-vault-items-list/empty-vault-items-list";
interface IBaseListContainerProps {
  vaultTabType: VaultTabType;
  hasItems: boolean;
  children: JSX.Element;
}
const BaseListContainer = ({
  vaultTabType,
  hasItems,
  children,
}: IBaseListContainerProps) => {
  const { searchValue } = useSearchContext();
  const isSearching = searchValue !== "";
  if (!hasItems) {
    return isSearching ? (
      <NoResultsVaultItemsList
        vaultTabType={vaultTabType}
        searchValue={searchValue}
      />
    ) : (
      <EmptyVaultItemsList vaultTabType={vaultTabType} />
    );
  }
  return children;
};
export default BaseListContainer;
