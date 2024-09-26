import {
  AddCollectionRequest,
  CollectionCommandResult,
  CreateCollectionCommandResult,
  DeleteCollectionRequest,
  RemoveItemsFromCollectionsRequest,
  UpdateCollectionRequest,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type CollectionCommands = {
  addCollection: Command<AddCollectionRequest, CreateCollectionCommandResult>;
  deleteCollection: Command<DeleteCollectionRequest, CollectionCommandResult>;
  removeItemsFromCollections: Command<
    RemoveItemsFromCollectionsRequest,
    CollectionCommandResult
  >;
  updateCollection: Command<UpdateCollectionRequest, CollectionCommandResult>;
};
