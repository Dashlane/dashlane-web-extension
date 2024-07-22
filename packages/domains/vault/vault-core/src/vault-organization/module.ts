import { Module } from "@dashlane/framework-application";
import { vaultOrganizationApi } from "@dashlane/vault-contracts";
import {
  CreateCollectionCommandHandler,
  DeleteCollectionCommandHandler,
  UpdateCollectionCommandHandler,
} from "./handlers/commands";
import { CollectionsQueryHandler } from "./handlers/queries";
import { CollectionsStore } from "./store/collections-store";
@Module({
  api: vaultOrganizationApi,
  stores: [CollectionsStore],
  handlers: {
    commands: {
      deleteCollection: DeleteCollectionCommandHandler,
      createCollection: CreateCollectionCommandHandler,
      updateCollection: UpdateCollectionCommandHandler,
    },
    events: {},
    queries: {
      queryCollections: CollectionsQueryHandler,
    },
  },
  requiredFeatureFlips: [
    "vault_web_collection_migration_space_prod_v2",
    "vault_web_popupSavedState_release",
    "sharingVault_web_bulkaddtocollection_dev",
  ],
})
export class VaultOrganizationModule {}
