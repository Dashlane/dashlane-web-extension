import { Module } from "@dashlane/framework-application";
import { vaultSearchApi } from "@dashlane/vault-contracts";
import { VaultSearchQueryHandler } from "./handlers/queries";
import { VaultRepository } from "../vault-repository";
@Module({
  api: vaultSearchApi,
  handlers: {
    commands: {},
    events: {},
    queries: {
      search: VaultSearchQueryHandler,
    },
  },
  providers: [VaultRepository],
})
export class VaultSearchModule {}
