import { CoreServices } from "Services/index";
import { EventBusService, TeamSpaceContentControlDone } from "EventBus";
import { revokeRemoteControlledSharedItems } from "Sharing/2/Services/SharingRemoteControlService";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  const { storeService, applicationModulesAccess } = services;
  const { sharingInvites, sharingItems } =
    applicationModulesAccess.createClients();
  eventBus.teamSpaceContentControlDone.on(
    (event: TeamSpaceContentControlDone) => {
      revokeRemoteControlledSharedItems(
        storeService,
        sharingItems,
        sharingInvites,
        event
      );
    }
  );
}
