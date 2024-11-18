import { EventBusService } from "EventBus";
import { triggerMasterPasswordLeakCheck } from "PasswordLeak/triggers";
import { CoreServices } from "Services";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus._sessionOpened.on(() => {
    void triggerMasterPasswordLeakCheck(services);
  });
}
