import { EventBusService } from "EventBus";
import { triggerUpdatePhishingURLFile } from "AntiPhishing/triggers";
import { CoreServices } from "Services";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus.remoteFileChanged.on((fileName) =>
    triggerUpdatePhishingURLFile(services, fileName)
  );
}
