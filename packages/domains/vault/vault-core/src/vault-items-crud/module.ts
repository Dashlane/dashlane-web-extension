import { Module } from "@dashlane/framework-application";
import { CryptographyModule } from "@dashlane/framework-dashlane-application";
import {
  vaultItemsCrudApi,
  VaultItemsCrudFeatureFlips,
} from "@dashlane/vault-contracts";
import {
  CreateVaultItemCommandHandler,
  DeleteVaultItemCommandHandler,
  DeleteVaultItemsCommandHandler,
  EmitTemporaryVaultItemsEventCommandHandler,
  UpdateVaultItemCommandHandler,
} from "./handlers/commands";
import {
  CredentialsGloballyProtectedQueryHandler,
  DomainIconDetailsQueryHandler,
  RichIconsEnabledQueryHandler,
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
      deleteVaultItem: DeleteVaultItemCommandHandler,
      updateVaultItem: UpdateVaultItemCommandHandler,
      emitTemporaryVaultItemEvent: EmitTemporaryVaultItemsEventCommandHandler,
    },
    events: {},
    queries: {
      domainIconDetails: DomainIconDetailsQueryHandler,
      query: VaultItemsQueryHandler,
      credentialsGloballyProtected: CredentialsGloballyProtectedQueryHandler,
      richIconsEnabled: RichIconsEnabledQueryHandler,
    },
  },
  imports: [CryptographyModule],
  providers: [VaultItemsCommandEventsEmitter, VaultRepository],
  requiredFeatureFlips: Object.values(VaultItemsCrudFeatureFlips),
  domainName: "vault",
})
export class VaultItemsCrudModule {}
