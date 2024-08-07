import { Channel, createEventBus } from "ts-event-bus";
import {
  CarbonApiConnector,
  CarbonApiEvents,
  CarbonDebugConnector,
  CarbonLeelooConnector,
  CarbonMaverickConnector,
  DeviceLimitCapabilityConnector,
  ExtensionCarbonConnector,
} from "@dashlane/communication";
import {
  AutofillCarbonConnectors as AutofillCarbonConnectorsType,
  CarbonDebugConnector as CarbonDebugConnectorType,
  CarbonExtensionLegacyConnectors as CarbonExtensionLegacyConnectorsType,
  DeviceLimitInfrastructureConnector as DeviceLimitInfrastructureConnectorType,
  InfrastructureConnectors as InfrastructureConnectorsType,
  MaverickCarbonConnector as MaverickCarbonConnectorType,
  WebappCarbonConnector as WebappCarbonConnectorType,
} from "../connectors.types";
import {
  connectLocalChannels,
  LocalChannel,
} from "@dashlane/legacy-communication";
export function makeApiConnector(channels: Channel[]): CarbonApiEvents {
  return createEventBus({
    events: CarbonApiConnector,
    channels,
  });
}
export function makeDebugConnector(): CarbonDebugConnectorType {
  return createEventBus({
    events: CarbonDebugConnector,
  });
}
function makeLegacyCarbonExtensionConnector(channels: Channel[]) {
  return createEventBus({
    events: ExtensionCarbonConnector,
    channels,
  });
}
export function makeLegacyCarbonWebappConnector(
  channels: Channel[],
  ignoredEvents?: (keyof typeof CarbonLeelooConnector)[]
): WebappCarbonConnectorType {
  return createEventBus({
    events: CarbonLeelooConnector,
    channels,
    ignoredEvents,
  }) as WebappCarbonConnectorType;
}
export function makeLegacyMaverickCarbonConnector(
  channels: Channel[]
): MaverickCarbonConnectorType {
  return createEventBus({
    events: CarbonMaverickConnector,
    channels,
  });
}
export function makeLegacyConnectors(
  runtimeChannels: Channel[]
): CarbonExtensionLegacyConnectorsType {
  const carbonToExtensionChannel = new LocalChannel();
  const extensionToCarbonChannel = new LocalChannel();
  connectLocalChannels(carbonToExtensionChannel, extensionToCarbonChannel);
  const carbonToExtensionLegacyConnector = makeLegacyCarbonExtensionConnector([
    ...runtimeChannels,
    carbonToExtensionChannel,
  ]);
  const extensionToCarbonLegacyConnector = makeLegacyCarbonExtensionConnector([
    extensionToCarbonChannel,
  ]);
  return {
    carbonToExtensionLegacyConnector,
    extensionToCarbonLegacyConnector,
  };
}
export function makeAutoFillEngineConnectors(
  carbonToAutofillEngineLocalChannel: LocalChannel
): AutofillCarbonConnectorsType {
  const autofillEngineToCarbonLocalChannel = new LocalChannel();
  connectLocalChannels(
    carbonToAutofillEngineLocalChannel,
    autofillEngineToCarbonLocalChannel
  );
  return {
    autofillEngineCarbonConnector: makeApiConnector([
      autofillEngineToCarbonLocalChannel,
    ]),
    autofillEngineLegacyCarbonConnector: makeLegacyMaverickCarbonConnector([
      autofillEngineToCarbonLocalChannel,
    ]),
  };
}
function makeDeviceLimitInfrastructureConnector(
  channels: Channel[]
): DeviceLimitInfrastructureConnectorType {
  return createEventBus({
    events: DeviceLimitCapabilityConnector,
    channels,
  });
}
export function makeInfrastructureConnectors(
  channels: Channel[]
): InfrastructureConnectorsType {
  return {
    deviceLimit: makeDeviceLimitInfrastructureConnector(channels),
  };
}
export const CARBON_GRAPHENE_TIMEOUT = 30000;
export function makeModulesConnector(
  carbonToModulesLocalChannel: LocalChannel
): CarbonApiEvents {
  const modulesToCarbonLocalChannel = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
  connectLocalChannels(
    carbonToModulesLocalChannel,
    modulesToCarbonLocalChannel
  );
  return makeApiConnector([modulesToCarbonLocalChannel]);
}
export function makeExtensionConnector(
  carbonToExtensionLocalChannel: LocalChannel
): CarbonApiEvents {
  const extensionToCarbonLocalChannel = new LocalChannel();
  connectLocalChannels(
    carbonToExtensionLocalChannel,
    extensionToCarbonLocalChannel
  );
  return makeApiConnector([extensionToCarbonLocalChannel]);
}
export function makeTiresiasBackgroundConnectors(
  carbonToTiresiasBackgroundLocalChannel: LocalChannel
): CarbonApiEvents {
  const tiresiasBackgroundToCarbonLocalChannel = new LocalChannel();
  connectLocalChannels(
    carbonToTiresiasBackgroundLocalChannel,
    tiresiasBackgroundToCarbonLocalChannel
  );
  return makeApiConnector([tiresiasBackgroundToCarbonLocalChannel]);
}
