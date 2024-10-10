import { EventBusService } from "EventBus";
import { CoreServices } from "Services";
import { loadRememberMeTypeToStore } from "Authentication/Services/loadRememberMeTypeToStore";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus.carbonSessionOpened.on(() => {
    loadRememberMeTypeToStore(services);
  });
}
