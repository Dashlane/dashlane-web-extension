export interface BaseCollectionVaultItem {
  id: string;
}
export interface CollectionVaultItem {
  id: string;
  type: string;
  url?: string;
}
export interface Collection {
  id: string;
  name: string;
  spaceId: string;
  vaultItems: CollectionVaultItem[];
}
