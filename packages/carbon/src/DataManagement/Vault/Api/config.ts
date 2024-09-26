import type { CommandQueryBusConfig } from "Shared/Infrastructure";
import {
  deleteVaultModuleItemHandler,
  deleteVaultModuleItemsBulkHandler,
  disableVaultProtectionHandler,
} from "./handlers";
import type { VaultCommands } from "./commands";
import type { VaultQueries } from "./queries";
export const vaultConfig: CommandQueryBusConfig<VaultCommands, VaultQueries> = {
  commands: {
    deleteVaultModuleItem: { handler: deleteVaultModuleItemHandler },
    deleteVaultModuleItemsBulk: {
      handler: deleteVaultModuleItemsBulkHandler,
    },
    disableVaultItemProtection: { handler: disableVaultProtectionHandler },
  },
  queries: {},
  liveQueries: {},
};
