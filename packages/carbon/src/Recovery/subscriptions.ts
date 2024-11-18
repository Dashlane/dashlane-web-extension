import { CoreServices } from "Services/index";
import { EventBusService } from "EventBus";
import { triggerCleanOrSetupAccountRecovery } from "./services/recovery-helpers";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus.carbonSessionOpened.on(() =>
    triggerCleanOrSetupAccountRecovery(services)
  );
  eventBus.syncSuccess.on(() => triggerCleanOrSetupAccountRecovery(services));
}
