import { Module } from "@dashlane/framework-application";
import { vaultNotificationsApi } from "@dashlane/vault-contracts";
import { VaultNotificationsStore } from "./stores/vault-notifications.store";
import { SetVaultNotificationsStatusCommandHandler } from "./handlers/commands/set-vault-notifications-status.command.handler";
import { GetVaultNotificationsStatusQueryHandler } from "./handlers/queries/get-vault-notifications-status.query.handler";
@Module({
  api: vaultNotificationsApi,
  handlers: {
    commands: {
      setVaultNotificationsStatus: SetVaultNotificationsStatusCommandHandler,
    },
    events: {},
    queries: {
      getVaultNotificationsStatus: GetVaultNotificationsStatusQueryHandler,
    },
  },
  stores: [VaultNotificationsStore],
})
export class VaultNotificationsModule {}
