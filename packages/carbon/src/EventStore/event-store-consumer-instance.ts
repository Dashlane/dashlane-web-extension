import { EventStoreConsumer } from "Infrastructure/EventStoreConsumer/event-store-consumer";
import { carbonEventHooks } from "EventStore/carbon-hooks";
import { CarbonEventStore } from "EventStore/carbon-event-store";
import { EventStore } from "Shared/Infrastructure/EventStore/event-store";
let consumer: EventStoreConsumer<CarbonEventStore> | null = null;
export const setInstance = (eventStore: EventStore<CarbonEventStore>): void => {
  consumer = new EventStoreConsumer(eventStore, carbonEventHooks);
};
export const getInstance = (): EventStoreConsumer<CarbonEventStore> => {
  if (!consumer) {
    throw new Error("Cannot get EventStoreConsumer instance");
  }
  return consumer;
};
export const clearInstance = () => {
  if (consumer) {
    consumer.teardown();
  }
  consumer = null;
};
