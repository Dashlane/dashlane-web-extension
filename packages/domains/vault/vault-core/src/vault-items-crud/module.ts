import { Module } from "@dashlane/framework-application";
import { CryptographyModule } from "@dashlane/framework-dashlane-application";
import {
  vaultItemsCrudApi,
  VaultItemsCrudFeatureFlips,
} from "@dashlane/vault-contracts";
import {
  CreateVaultItemCommandHandler,
  DeleteVaultItemsCommandHandler,
  EmitTemporaryVaultItemsEventCommandHandler,
  UpdateVaultItemCommandHandler,
} from "./handlers/commands";
import {
  DomainIconDetailsQueryHandler,
  RichIconsEnabledQueryHandler,
  SecureNoteCategoryQueryHandler,
  VaultItemsQueryHandler,
} from "./handlers/queries";
import { VaultItemsCommandEventsEmitter } from "./handlers/events/events-emitter";
import { VaultRepository } from "../vault-repository";
@Module({
  api: vaultItemsCrudApi,
  handlers: {
    commands: {
      createVaultItem: CreateVaultItemCommandHandler,
      deleteVaultItems: DeleteVaultItemsCommandHandler,
      updateVaultItem: UpdateVaultItemCommandHandler,
      emitTemporaryVaultItemEvent: EmitTemporaryVaultItemsEventCommandHandler,
    },
    events: {},
    queries: {
      domainIconDetails: DomainIconDetailsQueryHandler,
      query: VaultItemsQueryHandler,
      secureNoteCategory: SecureNoteCategoryQueryHandler,
      richIconsEnabled: RichIconsEnabledQueryHandler,
    },
  },
  imports: [CryptographyModule],
  providers: [VaultItemsCommandEventsEmitter, VaultRepository],
  requiredFeatureFlips: Object.values(VaultItemsCrudFeatureFlips),
})
export class VaultItemsCrudModule {}
