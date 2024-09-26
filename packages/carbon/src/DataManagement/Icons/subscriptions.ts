import { CoreServices } from "Services/index";
import { EventBusService } from "EventBus";
import { getInstance as getEventStoreInstance } from "EventStore/event-store-instance";
import { getInstance as getEventStoreConsumerInstance } from "EventStore/event-store-consumer-instance";
const refreshIcons = async () => {
  const eventStore = getEventStoreInstance();
  const eventStoreConsumer = getEventStoreConsumerInstance();
  const iconsLock = eventStoreConsumer.lockTopic("iconsUpdates");
  await eventStore.add("iconsUpdates", {
    type: "refresh",
  });
  eventStoreConsumer.releaseTopic("iconsUpdates", iconsLock);
};
export function setupSubscriptions(
  eventBus: EventBusService,
  _services: CoreServices
) {
  eventBus.syncSuccess.on(async () => {
    await refreshIcons();
  });
  eventBus.syncFailure.on(async () => {
    await refreshIcons();
  });
}
