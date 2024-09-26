import { slot } from "ts-event-bus";
import {
  AddCollectionRequest,
  CollectionCommandResult,
  CreateCollectionCommandResult,
  DeleteCollectionRequest,
  RemoveItemsFromCollectionsRequest,
  UpdateCollectionRequest,
} from "./types";
export const collectionsCommandsSlots = {
  addCollection: slot<AddCollectionRequest, CreateCollectionCommandResult>(),
  deleteCollection: slot<DeleteCollectionRequest, CollectionCommandResult>(),
  removeItemsFromCollections: slot<
    RemoveItemsFromCollectionsRequest,
    CollectionCommandResult
  >(),
  updateCollection: slot<UpdateCollectionRequest, CollectionCommandResult>(),
};
