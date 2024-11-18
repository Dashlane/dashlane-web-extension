import { defineModuleApi } from "@dashlane/framework-contracts";
import { VaultSearchQuery, VaultSearchRankedQuery } from "./queries";
export const vaultSearchApi = defineModuleApi({
  name: "vaultSearch" as const,
  commands: {},
  events: {},
  queries: {
    vaultSearchRanked: VaultSearchRankedQuery,
    search: VaultSearchQuery,
  },
});
