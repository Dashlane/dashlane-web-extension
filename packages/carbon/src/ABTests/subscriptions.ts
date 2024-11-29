import { AppInitialized, EventBusService } from "EventBus";
import { CoreServices } from "Services";
import { InitMode } from "Sdk/Default/types";
import { fetchABTestingVersionDetails } from "ABTests/ABTesting";
import { triggerABTestingChanged } from "Device/DeviceCommunication";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus.appInitialized.on(async (event: AppInitialized) => {
    if (event.initMode === InitMode.FirstInit) {
      await fetchABTestingVersionDetails(services, {
        abTestForcedVersion: event.abTestForcedVersion,
      });
      const abTesting = services.storeService.getABTesting();
      triggerABTestingChanged(abTesting);
    }
  });
}
