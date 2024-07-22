import { defineModuleApi } from "@dashlane/framework-contracts";
import { SetVaultNotificationsStatusCommand } from "./commands";
import { GetVaultNotificationsStatusQuery } from "./queries";
export const vaultNotificationsApi = defineModuleApi({
  name: "vaultNotifications" as const,
  commands: {
    setVaultNotificationsStatus: SetVaultNotificationsStatusCommand,
  },
  events: {},
  queries: {
    getVaultNotificationsStatus: GetVaultNotificationsStatusQuery,
  },
});
