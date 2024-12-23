import { AppDefinition } from "@dashlane/application-extension-definition";
import { CoreServices } from "@dashlane/carbon";
import {
  CarbonApiEvents,
  CarbonLeelooConnector,
} from "@dashlane/communication";
import { App } from "@dashlane/framework-application";
export interface CarbonReadyHandler {
  app: App<AppDefinition>;
  signalCarbonReady: (
    coreServices: CoreServices,
    events: CarbonApiEvents,
    leelooEvents: typeof CarbonLeelooConnector
  ) => void;
  signalCarbonInitFailed: (error: unknown) => void;
}
