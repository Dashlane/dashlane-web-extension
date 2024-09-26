import { CoreServices } from "Services/index";
import { EventBusService } from "EventBus";
import { setupSubscriptions as setupSmartTeamSpacesSubscriptions } from "DataManagement/SmartTeamSpaces/team-space-content-control.subscriptions";
import { setupSubscriptions as setupBreachesSubscriptions } from "DataManagement/Breaches/subscriptions";
import { setupSubscriptions as setupIconsSubscriptions } from "DataManagement/Icons/subscriptions";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  setupSmartTeamSpacesSubscriptions(eventBus, services);
  setupBreachesSubscriptions(eventBus, services);
  setupIconsSubscriptions(eventBus, services);
}
