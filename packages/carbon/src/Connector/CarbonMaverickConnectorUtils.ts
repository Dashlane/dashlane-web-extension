import * as communication from "@dashlane/communication";
import { makeDataManagementController } from "DataManagement/DataManagementController";
import { CarbonServices, getCoreServices } from "Services";
import { updateWebOnboardingMode } from "Session/OnboardingController";
import { setEventBus } from "./CarbonMaverickConnector";
export function subscribeToMaverickEvents(
  eventBus: typeof communication.CarbonMaverickConnector,
  carbonServices: CarbonServices
): void {
  setEventBus(eventBus);
  const coreServices = getCoreServices(carbonServices);
  const dataManagementController = makeDataManagementController(coreServices);
  eventBus.savePersonalDataItem.on((event) => {
    dataManagementController.savePersonalDataItem(event);
  });
  eventBus.filledDataItem.on((event) =>
    dataManagementController.updateMetadataItemFilledOnPage(
      event.id,
      event.url,
      event.dataType
    )
  );
  eventBus.updateWebOnboardingMode.on((webOnboardingMode) =>
    updateWebOnboardingMode(
      coreServices.storeService,
      coreServices.sessionService,
      webOnboardingMode
    )
  );
}
