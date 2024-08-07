import {
  CarbonApiEvents,
  CarbonDebugConnector,
  CarbonLeelooConnector,
  CarbonMaverickConnector,
  DeviceLimitCapabilityConnector,
  ExtensionCarbonConnector,
} from "@dashlane/communication";
export type ExtensionCarbonConnector = typeof ExtensionCarbonConnector;
export type WebappCarbonConnector = typeof CarbonLeelooConnector;
export type MaverickCarbonConnector = typeof CarbonMaverickConnector;
export type CarbonDebugConnector = typeof CarbonDebugConnector;
export type DeviceLimitInfrastructureConnector =
  typeof DeviceLimitCapabilityConnector;
export interface CarbonExtensionLegacyConnectors {
  carbonToExtensionLegacyConnector: ExtensionCarbonConnector;
  extensionToCarbonLegacyConnector: ExtensionCarbonConnector;
}
export interface AutofillCarbonConnectors {
  autofillEngineCarbonConnector: CarbonApiEvents;
  autofillEngineLegacyCarbonConnector: MaverickCarbonConnector;
}
export interface InfrastructureConnectors {
  deviceLimit: DeviceLimitInfrastructureConnector;
}
export interface Connectors {
  autofillEngineCarbonConnector: CarbonApiEvents;
  autofillEngineLegacyCarbonConnector: MaverickCarbonConnector;
  carbonApiConnector: CarbonApiEvents;
  applicationModulesToCarbonApiConnector: CarbonApiEvents;
  carbonDebugConnector: CarbonDebugConnector;
  carbonInfrastructureConnectors: InfrastructureConnectors;
  carbonLegacyMaverickConnector: MaverickCarbonConnector;
  carbonLegacyWebappConnector: WebappCarbonConnector;
  carbonLegacyWebappConnectorForGraphene: WebappCarbonConnector;
  carbonToExtensionLegacyConnector: ExtensionCarbonConnector;
  extensionToCarbonApiConnector: CarbonApiEvents;
  extensionToCarbonLegacyConnector: ExtensionCarbonConnector;
  tiresiasBackgroundToCarbonConnector: CarbonApiEvents;
}
