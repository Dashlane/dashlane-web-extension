import { CoreServices } from "Services/index";
import { EventBusService } from "EventBus";
import { applyTeamSpaceContentControlRules } from "DataManagement/SmartTeamSpaces/team-space-content-control.app-service";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  const { sessionService, storeService, wsService, applicationModulesAccess } =
    services;
  eventBus._sessionOpened.on(() => {
    applyTeamSpaceContentControlRules(
      eventBus,
      sessionService,
      storeService,
      wsService,
      applicationModulesAccess
    );
  });
}
