import { AppDefinition } from "@dashlane/application-extension-definition";
import { AppSessionStorage, CarbonStorage } from "@dashlane/carbon";
import { CarbonApiEvents } from "@dashlane/communication";
import { App } from "@dashlane/framework-application";
import {
  CarbonDebugConnector,
  ExtensionCarbonConnector,
  InfrastructureConnectors,
  MaverickCarbonConnector,
  WebappCarbonConnector,
} from "../connectors.types";
export interface StartParams {
  apiConnector: CarbonApiEvents;
  debugConnector: CarbonDebugConnector;
  infrastructureConnectors: InfrastructureConnectors;
  legacyExtensionConnector: ExtensionCarbonConnector;
  legacyWebappConnector: WebappCarbonConnector;
  legacyMaverickConnector: MaverickCarbonConnector;
  publicPath: string;
  storageLayer: CarbonStorage;
  sessionStorage?: AppSessionStorage;
  app: App<AppDefinition>;
}
