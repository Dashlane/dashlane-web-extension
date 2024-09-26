interface CollectionVaultItem {
  id: string;
  type: string;
}
export type DeleteCollectionRequest = {
  id: string;
};
export type UpdateCollectionRequest = {
  id: string;
  name: string;
  spaceId: string;
  vaultItems: CollectionVaultItem[];
};
export type AddCollectionRequest = Omit<UpdateCollectionRequest, "id">;
export type RemoveItemsFromCollectionsRequest = {
  ids: string[];
};
export interface CollectionCommandSuccess {
  success: true;
}
export interface CollectionCommandError {
  success: false;
}
export interface CreateCollectionCommandSuccess
  extends CollectionCommandSuccess {
  id: string;
}
export type CreateCollectionCommandResult =
  | CreateCollectionCommandSuccess
  | CollectionCommandError;
export type CollectionCommandResult =
  | CollectionCommandSuccess
  | CollectionCommandError;
