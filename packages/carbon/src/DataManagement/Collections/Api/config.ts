import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { CollectionCommands } from "DataManagement/Collections/Api/commands";
import {
  addCollectionHandler,
  deleteCollectionHandler,
  removeItemsFromCollectionsHandler,
  updateCollectionHandler,
} from "DataManagement/Collections/handlers";
export const config: CommandQueryBusConfig<CollectionCommands> = {
  commands: {
    addCollection: { handler: addCollectionHandler },
    deleteCollection: { handler: deleteCollectionHandler },
    removeItemsFromCollections: {
      handler: removeItemsFromCollectionsHandler,
    },
    updateCollection: { handler: updateCollectionHandler },
  },
  queries: {},
  liveQueries: {},
};
