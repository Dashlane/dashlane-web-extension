import { storage } from '@dashlane/browser-utils';
import { CarbonApiConnector, CarbonLeelooConnector, DeviceLimitCapabilityConnector, } from '@dashlane/communication';
import { createEventBus } from 'ts-event-bus';
import { WorkerChannel } from './workerChannel';
import { connectLocalChannels, LocalChannel, } from '@dashlane/framework-infra/src/communication/channel/local-channel';
import { startApplicationModules } from './start-application-modules';
declare let self: CarbonWorker;
const ARGON2_WASM = 'assets/argon2/argon2.wasm';
async function getCarbon() {
    return await import('@dashlane/carbon');
}
async function makeConnectors() {
    const CARBON_GRAPHENE_TIMEOUT = 30000;
    const _CARBON_GRAPHENE_CHANNEL = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
    const _GRAPHENE_CARBON_CHANNEL = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
    connectLocalChannels(_CARBON_GRAPHENE_CHANNEL, _GRAPHENE_CARBON_CHANNEL);
    const _LEELOO_CARBON_TO_GRAPHENE_CHANNEL = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
    const _GRAPHENE_TO_LEELOO_CARBON_CHANNEL = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
    const carbon = await getCarbon();
    const grapheneLeelooCarbonConnector = createEventBus({
        events: CarbonLeelooConnector,
        channels: [_GRAPHENE_TO_LEELOO_CARBON_CHANNEL],
        ignoredEvents: carbon.LEGACY_LEELOO_SLOTS_TO_IGNORE,
    }) as typeof CarbonLeelooConnector;
    const channel = new WorkerChannel({
        worker: self,
        type: 'CarbonLeeloo',
        isHost: true,
    });
    const carbonApiConnector = createEventBus({
        events: CarbonApiConnector,
        channels: [channel, _CARBON_GRAPHENE_CHANNEL],
    });
    const carbonLelooConnector = createEventBus({
        events: CarbonLeelooConnector,
        channels: [channel, _LEELOO_CARBON_TO_GRAPHENE_CHANNEL],
    });
    const deviceLimitInfrastructureConnector = createEventBus({
        events: DeviceLimitCapabilityConnector,
        channels: [channel],
    });
    const appModulesCarbonConnector = createEventBus({
        events: CarbonApiConnector,
        channels: [_GRAPHENE_CARBON_CHANNEL],
    });
    connectLocalChannels(_CARBON_GRAPHENE_CHANNEL, _GRAPHENE_CARBON_CHANNEL);
    connectLocalChannels(_LEELOO_CARBON_TO_GRAPHENE_CHANNEL, _GRAPHENE_TO_LEELOO_CARBON_CHANNEL);
    return {
        appModulesCarbonConnector,
        carbonApiConnector,
        carbonLelooConnector,
        grapheneLeelooCarbonConnector,
        deviceLimitInfrastructureConnector,
    };
}
self.loadArgon2WasmBinary = async () => {
    const response = await fetch(ARGON2_WASM);
    const binaryContent = await response.arrayBuffer();
    return new Uint8Array(binaryContent);
};
self.addEventListener('message', async ({ data }) => {
    switch (data.type) {
        case 'init': {
            try {
                const connectors = await makeConnectors();
                const { app, signalCarbonReady } = await startApplicationModules();
                const carbon = await getCarbon();
                const storageLayer = await storage.makeBrowserStorage();
                const carbonServices = await carbon.init({
                    abTestForcedVersion: data.abTestForcedVersion,
                    connectors: {
                        api: connectors.carbonApiConnector,
                        leeloo: connectors.carbonLelooConnector,
                    },
                    infrastructure: {
                        connectors: {
                            deviceLimit: connectors.deviceLimitInfrastructureConnector,
                        },
                    },
                    keys: data.keys,
                    platformInfo: data.platformInfo,
                    publicPath: data.publicPath,
                    settings: data.settings,
                    storageLayer,
                    workers: {
                        WebCryptoPolyfill: 'assets/workers/webCryptoPolyfill',
                        PBKDF2WebpackWorker: 'assets/workers/pbkdf2Worker',
                        pbkdf2PolyfillWorker: 'assets/workers/pbkdf2PolyfillWorker.js',
                    },
                    config: {
                        CODE_NAME: 'hosted-webapp',
                        ...data.config,
                    },
                    createClients: app.createClient as any,
                });
                signalCarbonReady(carbonServices, connectors.appModulesCarbonConnector, connectors.grapheneLeelooCarbonConnector);
                self.postMessage({ type: 'initSuccess' });
            }
            catch (err) {
                self.postMessage({ type: 'initFailure', error: err });
            }
            break;
        }
    }
}, false);
