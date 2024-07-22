import { defineModuleApi } from "@dashlane/framework-contracts";
import { RunSharingSyncCommand } from "./commands";
import {} from "./events";
import {} from "./queries";
export const sharingSyncApi = defineModuleApi({
  name: "sharingSync" as const,
  commands: {
    runSharingSync: RunSharingSyncCommand,
  },
  events: {},
  queries: {},
});
