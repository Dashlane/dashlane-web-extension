import { LEGACY_LEELOO_SLOTS_TO_IGNORE } from '@dashlane/carbon';
import { connectLocalChannels, LocalChannel, PortNames, RuntimeOnConnectMultiple, RuntimeOnConnectSingle, } from '@dashlane/legacy-communication';
import { Connectors } from './connectors.types';
import { CARBON_GRAPHENE_TIMEOUT, makeAutoFillEngineConnectors as makeAutoFillEngineCarbonConnectors, makeApiConnector as makeCarbonApiConnector, makeDebugConnector as makeCarbonDebugConnector, makeInfrastructureConnectors as makeCarbonInfrastructureConnectors, makeLegacyConnectors as makeCarbonLegacyConnectors, makeExtensionConnector, makeLegacyCarbonWebappConnector, makeLegacyMaverickCarbonConnector, makeModulesConnector, makeTiresiasBackgroundConnectors, } from './carbon/carbon-connectors';
import { logInfo } from '../logs/console/logger';
const COMM_TIMEOUT = ***** ? 5000 : 3600000;
const { PopupCarbon, PopupCarbonLoader, OptionsCarbon, WebappCarbon } = PortNames;
export function makeConnectors(): Connectors {
    logInfo({
        message: `Making connectors with COMM_TIMEOUT: ${COMM_TIMEOUT}`,
        tags: ['initBackground', 'makeConnectors'],
    });
    const runtimeOnConnectPopupLoaderChannel = new RuntimeOnConnectSingle(PopupCarbonLoader, COMM_TIMEOUT);
    runtimeOnConnectPopupLoaderChannel.listen();
    const runtimeOnConnectPopupChannel = new RuntimeOnConnectSingle(PopupCarbon, COMM_TIMEOUT);
    runtimeOnConnectPopupChannel.listen();
    const runtimeOnConnectOptionsChannel = new RuntimeOnConnectSingle(OptionsCarbon, COMM_TIMEOUT);
    runtimeOnConnectOptionsChannel.listen();
    const runtimeOnConnectWebappChannel = new RuntimeOnConnectMultiple(WebappCarbon, COMM_TIMEOUT);
    runtimeOnConnectWebappChannel.listen();
    const carbonToAutofillEngineLocalChannel = new LocalChannel();
    const carbonToModulesLocalChannel = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
    const carbonApiToExtensionLocalChannel = new LocalChannel();
    const carbonToTiresiasBackground = new LocalChannel();
    const carbonLegacyMaverickConnector = makeLegacyMaverickCarbonConnector([
        carbonToAutofillEngineLocalChannel,
    ]);
    const { carbonToExtensionLegacyConnector, extensionToCarbonLegacyConnector, } = makeCarbonLegacyConnectors([
        runtimeOnConnectPopupLoaderChannel,
        runtimeOnConnectPopupChannel,
    ]);
    const carbonToGrapheneLeelooChannel = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
    const grapheneToCarbonLeelooChannel = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
    connectLocalChannels(carbonToGrapheneLeelooChannel, grapheneToCarbonLeelooChannel);
    const carbonLegacyWebappConnector = makeLegacyCarbonWebappConnector([
        runtimeOnConnectWebappChannel,
        carbonToGrapheneLeelooChannel,
    ]);
    const carbonLegacyWebappConnectorForGraphene = makeLegacyCarbonWebappConnector([grapheneToCarbonLeelooChannel], LEGACY_LEELOO_SLOTS_TO_IGNORE);
    const carbonApiConnector = makeCarbonApiConnector([
        runtimeOnConnectPopupLoaderChannel,
        runtimeOnConnectPopupChannel,
        runtimeOnConnectOptionsChannel,
        runtimeOnConnectWebappChannel,
        carbonToAutofillEngineLocalChannel,
        carbonToModulesLocalChannel,
        carbonApiToExtensionLocalChannel,
        carbonToTiresiasBackground,
    ]);
    const carbonDebugConnector = makeCarbonDebugConnector();
    const carbonInfrastructureConnectors = makeCarbonInfrastructureConnectors([
        runtimeOnConnectWebappChannel,
    ]);
    const { autofillEngineCarbonConnector, autofillEngineLegacyCarbonConnector, } = makeAutoFillEngineCarbonConnectors(carbonToAutofillEngineLocalChannel);
    const tiresiasBackgroundToCarbonConnector = makeTiresiasBackgroundConnectors(carbonToTiresiasBackground);
    const applicationModulesToCarbonApiConnector = makeModulesConnector(carbonToModulesLocalChannel);
    const extensionToCarbonApiConnector = makeExtensionConnector(carbonApiToExtensionLocalChannel);
    return {
        applicationModulesToCarbonApiConnector,
        autofillEngineCarbonConnector,
        autofillEngineLegacyCarbonConnector,
        carbonApiConnector,
        carbonDebugConnector,
        carbonInfrastructureConnectors,
        carbonLegacyMaverickConnector,
        carbonLegacyWebappConnector,
        carbonToExtensionLegacyConnector,
        extensionToCarbonApiConnector,
        extensionToCarbonLegacyConnector,
        tiresiasBackgroundToCarbonConnector,
        carbonLegacyWebappConnectorForGraphene,
    };
}
