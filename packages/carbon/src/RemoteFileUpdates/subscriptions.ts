import { CoreServicesReady, EventBusService } from "EventBus";
import {
  triggerDownloadRemoteFileUpdate,
  triggerLoadFileAtInit,
} from "RemoteFileUpdates/triggers";
import { InitMode } from "Sdk/Default/types";
import { CoreServices } from "Services";
import { isAuthenticatedSelector } from "Session/selectors";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus._sessionOpened.on(() =>
    triggerDownloadRemoteFileUpdate(services, true)
  );
  eventBus.sessionClosed.on(() =>
    triggerDownloadRemoteFileUpdate(services, false)
  );
  eventBus.coreServicesReady.on((event: CoreServicesReady) => {
    if (event.initMode !== InitMode.Resume) {
      return;
    }
    if (isAuthenticatedSelector(services.storeService.getState())) {
      triggerDownloadRemoteFileUpdate(services, true);
    } else {
      triggerLoadFileAtInit(services);
    }
  });
  eventBus.appInitialized.on(() => {
    triggerLoadFileAtInit(services);
  });
}
