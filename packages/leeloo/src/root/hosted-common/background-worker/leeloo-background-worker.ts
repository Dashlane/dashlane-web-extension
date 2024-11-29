import { storage } from "@dashlane/browser-utils";
import { startApplicationModules } from "./start-application-modules";
import { initCommunication } from "./init-communication";
declare let self: CarbonWorker;
const ARGON2_WASM = "assets/argon2/argon2.wasm";
async function getCarbon() {
  return await import("@dashlane/carbon");
}
self.loadArgon2WasmBinary = async () => {
  const response = await fetch(ARGON2_WASM);
  const binaryContent = await response.arrayBuffer();
  return new Uint8Array(binaryContent);
};
self.addEventListener(
  "message",
  async ({ data }) => {
    switch (data.type) {
      case "init": {
        try {
          const carbon = await getCarbon();
          const {
            appModulesCarbonConnector,
            carbonApiConnector,
            carbonLelooConnector,
            deviceLimitInfrastructureConnector,
            grapheneLeelooCarbonConnector,
            workerToPageGrapheneChannel,
          } = await initCommunication(
            self,
            carbon.LEGACY_LEELOO_SLOTS_TO_IGNORE
          );
          const { app, signalCarbonReady } = await startApplicationModules(
            workerToPageGrapheneChannel
          );
          const storageLayer = await storage.makeBrowserStorage();
          const carbonServices = await carbon.init({
            abTestForcedVersion: data.abTestForcedVersion,
            connectors: {
              api: carbonApiConnector,
              leeloo: carbonLelooConnector,
            },
            infrastructure: {
              connectors: {
                deviceLimit: deviceLimitInfrastructureConnector,
              },
            },
            keys: data.keys,
            platformInfo: data.platformInfo,
            publicPath: data.publicPath,
            settings: data.settings,
            storageLayer,
            config: {
              CODE_NAME: "hosted-webapp",
              ...data.config,
            },
            createClients: app.createClient as any,
          });
          signalCarbonReady(
            carbonServices,
            appModulesCarbonConnector,
            grapheneLeelooCarbonConnector
          );
          self.postMessage({ type: "initSuccess" });
        } catch (err) {
          self.postMessage({ type: "initFailure", error: err });
        }
        break;
      }
    }
  },
  false
);
