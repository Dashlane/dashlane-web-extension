import { Trigger } from "@dashlane/hermes";
import { AppInitialized, EventBusService } from "EventBus";
import { CoreServices } from "Services";
import { InitMode } from "Sdk/Default/types";
import { syncFailure } from "Session/Store/sync/actions";
import { isSyncInProgress } from "./UserSessionService";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus.appInitialized.on(async (event: AppInitialized) => {
    const { sessionService, storeService } = services;
    const syncInProgress = isSyncInProgress(storeService);
    if (syncInProgress) {
      storeService.dispatch(syncFailure());
      if (event.initMode === InitMode.Resume) {
        await sessionService.getInstance().user.attemptSync(Trigger.Wake);
      }
    }
  });
}
