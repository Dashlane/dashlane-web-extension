import { EventBusService } from "EventBus";
import { CoreServices } from "Services/";
import { triggerKillswitchCron } from "./cron";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus.appInitialized.on(() => {
    const { storeService } = services;
    triggerKillswitchCron(storeService);
  });
}
