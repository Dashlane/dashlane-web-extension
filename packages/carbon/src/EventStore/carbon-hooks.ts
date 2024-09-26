import { CarbonEventStore } from "EventStore/carbon-event-store";
import { Hooks } from "Shared/Infrastructure/EventStoreConsumer/types";
import { iconsUpdatesHook } from "DataManagement/Icons/EventStore/hook";
export const carbonEventHooks: Hooks<CarbonEventStore> = {
  iconsUpdates: iconsUpdatesHook,
};
