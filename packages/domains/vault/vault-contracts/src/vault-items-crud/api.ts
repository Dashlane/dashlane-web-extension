import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  CreateVaultItemCommand,
  DeleteVaultItemsCommand,
  EmitTemporaryVaultItemEventCommand,
  UpdateVaultItemCommand,
} from "./commands";
import { CreatedEvent, DeletedEvent, UpdatedEvent } from "./events";
import {
  DomainIconDetailsQuery,
  RichIconsEnabledQuery,
  SecureNoteCategoryQuery,
  VaultItemsQuery,
} from "./queries";
export const vaultItemsCrudApi = defineModuleApi({
  name: "vaultItemsCrud" as const,
  commands: {
    createVaultItem: CreateVaultItemCommand,
    deleteVaultItems: DeleteVaultItemsCommand,
    updateVaultItem: UpdateVaultItemCommand,
    emitTemporaryVaultItemEvent: EmitTemporaryVaultItemEventCommand,
  },
  events: {
    createdEvent: CreatedEvent,
    deletedEvent: DeletedEvent,
    updatedEvent: UpdatedEvent,
  },
  queries: {
    domainIconDetails: DomainIconDetailsQuery,
    query: VaultItemsQuery,
    secureNoteCategory: SecureNoteCategoryQuery,
    richIconsEnabled: RichIconsEnabledQuery,
  },
});
