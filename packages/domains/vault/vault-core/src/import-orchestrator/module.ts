import { Module } from "@dashlane/framework-application";
import {
  importOrchestratorApi,
  VaultImportOrchestratorFeatureFlips,
} from "@dashlane/vault-contracts";
import { ImportStore } from "./import-store";
import {} from "./handlers/commands";
import {} from "./handlers/events";
import {} from "./handlers/queries";
@Module({
  api: importOrchestratorApi,
  stores: [ImportStore],
  requiredFeatureFlips: Object.values(VaultImportOrchestratorFeatureFlips),
  handlers: {
    commands: {},
    events: {},
    queries: {},
  },
  domainName: "vault",
})
export class ImportOrchestratorModule {}
