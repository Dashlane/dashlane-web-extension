import { Collection, VaultItem } from "@dashlane/vault-contracts";
interface SearchResultItemBaseProps {
  index: number;
  matchCount: number;
}
export interface SearchResultVaultItemProps extends SearchResultItemBaseProps {
  item: VaultItem;
}
export interface SearchResultCollectionItemProps
  extends SearchResultItemBaseProps {
  item: Collection;
}
