import { EventStore } from "Shared/Infrastructure/EventStore/event-store";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { CarbonEventStore } from "EventStore/carbon-event-store";
import { defaultCarbonEventStore } from "EventStore/default-carbon-event-store";
export class LocalStorageEventStore extends EventStore<CarbonEventStore> {
  constructor(private localStorageService: LocalStorageService) {
    super();
  }
  protected async store(eventStore: Partial<CarbonEventStore>): Promise<void> {
    await this.localStorageService.getInstance().storeEventStore(eventStore);
  }
  protected async retrieve(): Promise<CarbonEventStore> {
    const stored = await this.localStorageService.getInstance().getEventStore();
    if (stored === null) {
      return defaultCarbonEventStore;
    }
    return {
      iconsUpdates: stored.iconsUpdates || defaultCarbonEventStore.iconsUpdates,
    };
  }
}
