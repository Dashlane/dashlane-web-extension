import { EventBusService } from "EventBus";
import { CoreServices } from "Services";
import { getInstance as getBreachesUpdaterInstance } from "DataManagement/Breaches/AppServices/breaches-updater";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  const { applicationModulesAccess, storeService, wsService } = services;
  eventBus.syncSuccess.on(() => {
    const breachesUpdater = getBreachesUpdaterInstance(
      applicationModulesAccess,
      storeService,
      wsService
    );
    breachesUpdater.refresh({ forceRefresh: false });
  });
}
