import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { DuplicationCommands } from "./commands";
import { duplicateVaultItemHandler } from "../duplicate-vault-item.handler";
export const config: CommandQueryBusConfig<DuplicationCommands> = {
  commands: {
    duplicateVaultItem: { handler: duplicateVaultItemHandler },
  },
  queries: {},
  liveQueries: {},
};
