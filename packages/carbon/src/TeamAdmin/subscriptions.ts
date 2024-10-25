import { CoreServices } from "Services/index";
import { EventBusService } from "EventBus";
import { makeSharingService } from "Sharing/2/Services";
import { isDirectorySyncActivated } from "TeamAdmin/Services/DirectorySyncService";
import { makeDirectorySyncController } from "TeamAdmin/DirectorySyncController";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  const { sessionService, storeService, localStorageService, wsService } =
    services;
  const sharingService = makeSharingService(storeService, wsService);
  const directorySyncController = makeDirectorySyncController({
    sessionService,
    sharingService,
    storeService,
    localStorageService,
    wsService,
  });
  eventBus.syncSuccess.on(() => {
    const spaceData = storeService.getSpaceData();
    const featureActivated = isDirectorySyncActivated(spaceData);
    if (featureActivated) {
      directorySyncController.directorySyncForAllTeams();
    }
  });
}
