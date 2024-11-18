import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  CreateVaultItemCommand,
  DeleteVaultItemCommand,
  DeleteVaultItemsCommand,
  EmitTemporaryVaultItemEventCommand,
  UpdateVaultItemCommand,
} from "./commands";
import { CreatedEvent, DeletedEvent, UpdatedEvent } from "./events";
import {
  CredentialsGloballyProtectedQuery,
  DomainIconDetailsQuery,
  RichIconsEnabledQuery,
  VaultItemsQuery,
} from "./queries";
export const vaultItemsCrudApi = defineModuleApi({
  name: "vaultItemsCrud" as const,
  commands: {
    deleteVaultItem: DeleteVaultItemCommand,
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
    richIconsEnabled: RichIconsEnabledQuery,
    credentialsGloballyProtected: CredentialsGloballyProtectedQuery,
  },
});
