import { EventBusService } from "EventBus";
import { CoreServices } from "Services";
import { sendUserSettingsLog } from "./Services/send-user-settings-log";
export function setupUserSettingsLogSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus._sessionOpened.on(() => {
    sendUserSettingsLog(services);
  });
}
