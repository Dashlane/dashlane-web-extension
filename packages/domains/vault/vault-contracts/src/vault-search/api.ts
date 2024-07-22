import { defineModuleApi } from "@dashlane/framework-contracts";
import { VaultSearchQuery } from "./queries";
export const vaultSearchApi = defineModuleApi({
  name: "vaultSearch" as const,
  commands: {},
  events: {},
  queries: {
    search: VaultSearchQuery,
  },
});
