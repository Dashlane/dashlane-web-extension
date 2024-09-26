import { defineModuleApi } from "@dashlane/framework-contracts";
import { commands } from "./carbon-legacy-commands";
import { events } from "./carbon-legacy-events";
import { queries } from "./carbon-legacy-queries";
export const carbonLegacyApi = defineModuleApi({
  name: "carbon-legacy" as const,
  commands,
  queries,
  events,
});
export type CarbonModuleApi = typeof carbonLegacyApi;
