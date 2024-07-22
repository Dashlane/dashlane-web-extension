import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  CreateCollectionCommand,
  DeleteCollectionCommand,
  UpdateCollectionCommand,
} from "./commands";
import { CollectionsQuery } from "./queries";
export const vaultOrganizationApi = defineModuleApi({
  name: "vaultOrganization" as const,
  commands: {
    deleteCollection: DeleteCollectionCommand,
    createCollection: CreateCollectionCommand,
    updateCollection: UpdateCollectionCommand,
  },
  events: {},
  queries: {
    queryCollections: CollectionsQuery,
  },
});
