import { CarbonLegacyDeviceRemotelyDeleted } from "@dashlane/communication";
import { EventHandler, IEventHandler } from "@dashlane/framework-application";
import {
  SessionsStateStore,
  SessionStoreMutex,
} from "../../stores/sessions-state.store";
@EventHandler(CarbonLegacyDeviceRemotelyDeleted)
export class CarbonLegacyDeviceRemotelyDeletedEventHandler
  implements IEventHandler<CarbonLegacyDeviceRemotelyDeleted>
{
  constructor(private store: SessionsStateStore) {}
  async handle({
    body: { user },
  }: CarbonLegacyDeviceRemotelyDeleted): Promise<void> {
    await SessionStoreMutex.runExclusive(async () => {
      const state = await this.store.getState();
      delete state[user];
      await this.store.set(state);
    });
  }
}
