import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { SetVaultNotificationsStatusCommand } from "@dashlane/vault-contracts";
import { VaultNotificationsStore } from "../../stores/vault-notifications.store";
@CommandHandler(SetVaultNotificationsStatusCommand)
export class SetVaultNotificationsStatusCommandHandler
  implements ICommandHandler<SetVaultNotificationsStatusCommand>
{
  constructor(private readonly store: VaultNotificationsStore) {}
  async execute({ body }: SetVaultNotificationsStatusCommand) {
    const { notificationName, isEnabled } = body;
    try {
      const storeState = await this.store.getState();
      await this.store.set({
        ...storeState,
        [notificationName]: isEnabled,
      });
      return success(undefined);
    } catch {
      throw new Error(
        "SetVaultNotificationsStatus command from vault-core failed"
      );
    }
  }
}
