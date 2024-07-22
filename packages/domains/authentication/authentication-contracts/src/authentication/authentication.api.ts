import { defineModuleApi } from "@dashlane/framework-contracts";
import { CanLockAppQuery } from "./authentication.queries";
export const authenticationApi = defineModuleApi({
  name: "authentication" as const,
  commands: {},
  events: {},
  queries: {
    canLockApp: CanLockAppQuery,
  },
});
