import { Module } from "@dashlane/framework-application";
import { vaultSearchApi } from "@dashlane/vault-contracts";
import {
  VaultSearchQueryHandler,
  VaultSearchRankedQueryHandler,
} from "./handlers/queries";
import { VaultRepository } from "../vault-repository";
@Module({
  api: vaultSearchApi,
  handlers: {
    commands: {},
    events: {},
    queries: {
      search: VaultSearchQueryHandler,
      vaultSearchRanked: VaultSearchRankedQueryHandler,
    },
  },
  providers: [VaultRepository],
})
export class VaultSearchModule {}
