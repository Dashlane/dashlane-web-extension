import { AppDefinition } from "@dashlane/application-extension-definition";
import {
  CarbonApiEvents,
  CarbonLeelooConnector,
} from "@dashlane/communication";
import type { CoreServices } from "@dashlane/carbon";
import { App } from "@dashlane/framework-application";
export interface CarbonReadyHandler {
  app: App<AppDefinition>;
  signalCarbonReady: (
    coreServices: CoreServices,
    events: CarbonApiEvents,
    leelooEvents: typeof CarbonLeelooConnector
  ) => void;
}
