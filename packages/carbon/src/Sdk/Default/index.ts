import { omit } from "ramda";
import {
  CarbonApiConnector,
  CarbonLeelooConnector,
  CarbonMaverickConnector,
  ExceptionCriticality,
  ExtensionCarbonConnector,
  PlatformInfo,
} from "@dashlane/communication";
import { createEventBus } from "ts-event-bus";
import { subscribeToExtensionEvents } from "Connector/ExtensionCarbonConnectorUtils";
import { subscribeToLeelooEvents } from "Connector/carbon-leeloo-connector-utils";
import { subscribeToMaverickEvents } from "Connector/CarbonMaverickConnectorUtils";
import { subscribeToDebugEvents } from "Connector/CarbonDebugConnector";
import { subscribeToE2EEvents } from "Connector/CarbonE2EConnector";
import { initAuthenticatedCarbonApplication } from "Application";
import { setPlatformInfo } from "Application/platform-info";
import { StoreService } from "Store/";
import { WSService } from "Libs/WS/index";
import { InitOptions } from "init-options";
import {
  CarbonServices,
  carbonServices,
  CarbonServicesTypeEnum,
  getCoreServices,
} from "Services/";
import {
  saveCurrentLocation,
  savePlatformInfo,
} from "Session/Store/platform/actions";
import { sendExceptionLog } from "Logs/Exception";
import { setPlugins } from "Libs/Plugins";
import { CarbonCommands, CarbonLiveQueries, CarbonQueries } from "Api";
import { loadFrequencyLists } from "Health/Strength/evaluatePasswordStrength";
import { setupEventBus } from "Sdk/Default/setup-event-bus";
import { TsEventBusCommandQueryBus } from "Infrastructure/CommandQueryBus/TsEventBusCommandQueryBus";
import { bootstrap } from "Sdk/Default/bootstrap";
import { setPublicPath } from "Assets/public-path";
import { CarbonLocalStorage } from "Libs/Storage";
import { InitMode } from "./types";
import { appSessionIdSelector } from "Application/Store/application/selectors";
import { loadAnonymousApplicationId } from "Device/Storage/anonymousApplicationId";
import { DashlaneAPISchemesNames, setConfig } from "config-service";
import { initWebServicesConfig } from "./init-webservices-config";
function inferInitMode(storeService: StoreService): InitMode {
  const state = storeService.getState();
  const applicationSessionId = appSessionIdSelector(state);
  const initMode = applicationSessionId ? InitMode.Resume : InitMode.FirstInit;
  console.log(`[background/carbon] Init mode inferred: ${initMode}`);
  return initMode;
}
export const setPlatform = (
  services: CarbonServices,
  platformInfo: PlatformInfo,
  initMode: InitMode
) => {
  if (initMode === InitMode.FirstInit) {
    const storeService = services.getInstance<StoreService>(
      CarbonServicesTypeEnum.StoreService
    );
    storeService.getStore().dispatch(savePlatformInfo(platformInfo));
  }
  setPlatformInfo(platformInfo);
};
export async function initCarbon(
  options: InitOptions
): Promise<CarbonServices> {
  try {
    console.log(`[background/carbon] initializing...`);
    const wsConfigKeys = Object.values(DashlaneAPISchemesNames);
    setConfig(omit(wsConfigKeys, options?.config ?? {}));
    setPublicPath(options.publicPath);
    if (!options.storageLayer) {
      throw new Error("Missing Storage layer prevents Carbon initialization");
    }
    const services = carbonServices({
      storageLayer: new CarbonLocalStorage(options.storageLayer),
      sessionStorage: options.sessionStorage,
      createClients: options.createClients,
    });
    const { storeService, storageService, applicationModulesAccess } =
      getCoreServices(services);
    await storeService.completeRehydration();
    loadAnonymousApplicationId(storageService, storeService);
    const initMode = inferInitMode(storeService);
    setPlatform(services, options.platformInfo, initMode);
    await initWebServicesConfig(
      options,
      applicationModulesAccess,
      options.platformInfo
    );
    const eventBusService = setupEventBus(services);
    console.log(
      `[background/carbon] Publishing lifecycle event coreServicesReady`
    );
    try {
      await eventBusService.coreServicesReady({ initMode });
    } catch (error) {
      console.error(
        `[background/carbon] Failed publishing lifecycle event coreServicesReady`,
        error
      );
      throw error;
    }
    loadFrequencyLists();
    if (options.plugins) {
      setPlugins(options.plugins);
    }
    await initAuthenticatedCarbonApplication(options, services, initMode);
    const { debug, e2e } = options.connectors;
    let { leeloo, maverick, extension, api } = options.connectors;
    console.log(`[background/carbon] Activating connectors`);
    leeloo = leeloo || createEventBus({ events: CarbonLeelooConnector });
    maverick = maverick || createEventBus({ events: CarbonMaverickConnector });
    extension =
      extension || createEventBus({ events: ExtensionCarbonConnector });
    api = api || createEventBus({ events: CarbonApiConnector });
    if (debug) {
      subscribeToDebugEvents(debug);
    }
    if (e2e) {
      subscribeToE2EEvents(e2e, services);
    }
    subscribeToExtensionEvents(extension, services);
    subscribeToLeelooEvents(leeloo, services);
    subscribeToMaverickEvents(maverick, services);
    const commandQueryBus = new TsEventBusCommandQueryBus<
      CarbonCommands,
      CarbonQueries,
      CarbonLiveQueries
    >(services, CarbonApiConnector, api);
    console.log(`[background/carbon] Connectors active`);
    bootstrap(services, commandQueryBus, options?.infrastructure);
    console.log(
      `[background/carbon] Publishing lifecycle event appInitialized`
    );
    eventBusService
      .appInitialized({
        initMode,
        abTestForcedVersion: options.abTestForcedVersion,
      })
      .catch((error) => {
        console.error(
          `[background/carbon] Failed publishing lifecycle event appInitialized`,
          error
        );
      });
    return services;
  } catch (error) {
    console.error(`[background/carbon] Initialization failed`, error);
    throw error;
  }
}
export function fetchCurrentLocation(
  wsService: WSService,
  storeService: StoreService
): Promise<void> {
  return wsService.country
    .getCurrentCountry()
    .then((locationInfo) => {
      storeService.dispatch(saveCurrentLocation(locationInfo));
    })
    .catch((error) => {
      const message = `[Sdk/Default] - fetchCurrentLocation: ${error}`;
      const augmentedError = new Error(message);
      sendExceptionLog({
        error: augmentedError,
        code: ExceptionCriticality.WARNING,
      });
    });
}
