import { EventStore } from "Shared/Infrastructure/EventStore/event-store";
import { CarbonEventStore } from "EventStore/carbon-event-store";
let eventStore: EventStore<CarbonEventStore> | null = null;
export const setInstance = (es: EventStore<CarbonEventStore>) => {
  eventStore = es;
};
export const getInstance = (): EventStore<CarbonEventStore> => {
  if (!eventStore) {
    throw new Error("Cannot get EventStore instance");
  }
  return eventStore;
};
export const clearInstance = () => {
  if (eventStore) {
    eventStore.teardown();
  }
  eventStore = null;
};
