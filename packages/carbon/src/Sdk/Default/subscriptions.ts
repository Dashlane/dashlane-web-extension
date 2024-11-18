import { AppInitialized, EventBusService } from "EventBus";
import { CoreServices } from "Services";
import { fetchCurrentLocation } from "Sdk/Default";
import { InitMode } from "Sdk/Default/types";
import { sendLocationInfo } from "Session/SessionCommunication";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus.appInitialized.on(async (event: AppInitialized) => {
    const { wsService, storeService } = services;
    if (event.initMode === InitMode.FirstInit) {
      await fetchCurrentLocation(wsService, storeService);
      sendLocationInfo(storeService.getPlatform().location);
    }
  });
}
