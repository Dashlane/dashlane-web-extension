import {
  declarativeNetRequestIsSupported,
  storageSessionIsSupported,
} from "@dashlane/webextensions-apis";
import { startCarbon } from "./communication/carbon/start";
import {
  makeSessionStorageLayer as makeCarbonSessionStorageLayer,
  makeStorageLayer as makeCarbonStorageLayer,
} from "./communication/carbon/storage-layer";
import { makeConnectors } from "./communication/connectors";
import { Connectors } from "./communication/connectors.types";
import { isServiceWorker } from "./lifecycle/service-worker/is-service-worker";
import { onInstall as onExtensionInstall } from "./lifecycle/extension/on-install";
import { onFirstInstall as onExtensionFirstInstall } from "./lifecycle/extension/on-first-install";
import { onStart as onExtensionStart } from "./lifecycle/extension/on-start";
import { onUpdate as onExtensionUpdate } from "./lifecycle/extension/on-update";
import { makeExtensionInitTasksRunner } from "./tasks/tasks";
import { initArgon } from "./tasks/argon2/init-argon";
import { initArgonForServiceWorker } from "./tasks/argon2/init-argon-for-service-worker";
import { initOnboarding } from "./tasks/onboarding/onboarding";
import { surveyOnUninstall } from "./tasks/uninstall-survey/survey-on-uninstall";
import { open as openWebAppSignUp } from "./tasks/webapp/open";
import { logFirstLaunch as logWebAppFirstLaunch } from "./tasks/logs/log-first-launch";
import { reloadOnLogout } from "./tasks/extension/reload-on-logout";
import { initToolbarIcon } from "./tasks/toolbar-icon/toolbar-icon";
import { initToolbarIconBadge } from "./tasks/toolbar-icon/toolbar-icon-badge";
import { initRedirection } from "./tasks/redirection/dynamic-rules";
import { initRedirectionFallback } from "./tasks/redirection-fallback/redirection";
import { initAntiphishingRedirectionFallback } from "./tasks/redirection-fallback/antiphishing-redirection";
import { initAutofillEngine } from "./tasks/autofill/init-autofill-engine";
import { initTiresias } from "./tasks/tiresias/init-tiresias";
import { startApplicationModules } from "./communication/modules/start-application-modules";
import { injectScriptOnExistingTabs } from "./tasks/autofill/inject-script-on-existing-tabs";
import { initDebugLogger } from "./logs/carbon/debugger";
import { disableBrowserNativeAutofill } from "@dashlane/framework-infra/spi";
import { setupLoggingLifecycleEvents } from "./lifecycle/log-lifecycle-events";
import { logger } from "./logs/app-logger";
const __REDACTED__ = "__REDACTED__";
const DASHLANE_CHROME_BETA_ID = "__REDACTED__";
const __REDACTED__ =
  process.env.NODE_ENV === "__REDACTED__" ||
  chrome.runtime.id === __REDACTED__ ||
  chrome.runtime.id === DASHLANE_CHROME_BETA_ID;
async function startCarbonAndModules(connectors: Connectors) {
  const carbonStorageLayer = makeCarbonStorageLayer();
  const sessionStorage = storageSessionIsSupported()
    ? makeCarbonSessionStorageLayer()
    : undefined;
  const { app, signalCarbonReady, signalCarbonInitFailed } =
    await startApplicationModules();
  const {
    applicationModulesToCarbonApiConnector,
    carbonApiConnector,
    carbonDebugConnector,
    carbonLegacyWebappConnectorForGraphene,
    carbonInfrastructureConnectors,
    carbonToExtensionLegacyConnector,
    carbonLegacyWebappConnector,
    carbonLegacyMaverickConnector,
  } = connectors;
  try {
    const carbon = await startCarbon({
      apiConnector: carbonApiConnector,
      debugConnector: carbonDebugConnector,
      infrastructureConnectors: carbonInfrastructureConnectors,
      legacyExtensionConnector: carbonToExtensionLegacyConnector,
      legacyWebappConnector: carbonLegacyWebappConnector,
      legacyMaverickConnector: carbonLegacyMaverickConnector,
      publicPath: "./",
      storageLayer: carbonStorageLayer,
      sessionStorage,
      app,
    });
    signalCarbonReady(
      carbon,
      applicationModulesToCarbonApiConnector,
      carbonLegacyWebappConnectorForGraphene
    );
  } catch (carbonInitError) {
    signalCarbonInitFailed(carbonInitError);
  }
  return app;
}
function initBackground() {
  try {
    logger.debug("Starting background initialization");
    setupLoggingLifecycleEvents();
    const connectors = makeConnectors();
    logger.debug("Starting Carbon & Application Modules");
    const appClientPromise = startCarbonAndModules(connectors)
      .then((app) => app.createClient())
      .catch((error) => {
        logger.error("Promise appClientPromise rejected", {
          error,
        });
        return Promise.reject(error);
      });
    logger.info("Running initialization tasks ...");
    const runInitTasks = makeExtensionInitTasksRunner({
      appClient: appClientPromise,
      connectors,
    });
    logger.info("Running redirection initialization tasks ...");
    const isDeclarativeNetRequestIsSupported =
      declarativeNetRequestIsSupported();
    if (isDeclarativeNetRequestIsSupported) {
      initRedirection(connectors.extensionToCarbonApiConnector);
    } else {
      initRedirectionFallback();
      initAntiphishingRedirectionFallback(
        connectors.extensionToCarbonApiConnector
      );
    }
    onExtensionStart(() => {
      logger.info("Initializing CarbonDebugConnector Debug Logger ...");
      initDebugLogger(connectors.carbonDebugConnector);
      logger.info("Initilializing argon2 ...");
      const argonInitializationFn = isServiceWorker()
        ? initArgonForServiceWorker
        : initArgon;
      argonInitializationFn();
      logger.info(
        'Running "onExtensionStart" init tasks with the app client promise ...'
      );
      runInitTasks.withAppClientPromise([
        { name: "reloadOnLogout", fn: reloadOnLogout },
        { name: "initAutofillEngine", fn: initAutofillEngine },
      ]);
      logger.info(
        'Running "onExtensionStart" init tasks with the app client ready ...'
      );
      runInitTasks.withAppClientReady([
        { name: "initOnboarding", fn: initOnboarding },
        { name: "surveyOnUninstall", fn: surveyOnUninstall },
        { name: "initToolbarIcon", fn: initToolbarIcon },
        { name: "initToolbarIconBadge", fn: initToolbarIconBadge },
        { name: "initTiresias", fn: initTiresias },
      ]);
    });
    onExtensionFirstInstall(() => {
      logger.info(
        'Running "onExtensionFirstInstall" init tasks with the app client ready ...'
      );
      runInitTasks.withAppClientReady([
        { name: "logWebAppFirstLaunch", fn: logWebAppFirstLaunch },
        { name: "openWebAppSignUp", fn: openWebAppSignUp },
      ]);
    });
    onExtensionInstall(() => {
      logger.info("Disabling browser native autofill ..");
      disableBrowserNativeAutofill();
    });
    onExtensionUpdate(() => {
      logger.info(
        'Running "onExtensionUpdate" init tasks with the app client ready ...'
      );
      runInitTasks.withAppClientReady([
        {
          name: "injectScriptOnExistingTabs",
          fn: injectScriptOnExistingTabs,
        },
      ]);
    });
    chrome.runtime.onStartup.addListener(() => {
      logger.info("chrome.runtime.onStartup event");
    });
    const chromeMV3MagicTricksEnabled = true;
    if (
      "serviceWorker" in self &&
      self instanceof ServiceWorkerGlobalScope &&
      chromeMV3MagicTricksEnabled
    ) {
      logger.info("Attaching Chrome MV3 Service Worker event handlers ...");
      const skipWaiting = self.skipWaiting;
      const clients = self.clients;
      self.oninstall = () => {
        logger.info("self.oninstall event");
        skipWaiting()
          .then(() => {
            logger.info("Promise skipWaiting() resolved");
          })
          .catch((error) => {
            logger.error("Promise skipWaiting() rejected", {
              error,
            });
            throw error;
          });
      };
      self.addEventListener("activate", (event: ExtendableEvent) => {
        logger.info("'activate' event triggered");
        event.waitUntil(
          new Promise((resolve) => {
            logger.info(
              'ExtendableEvent.waitUntil() pending on "activate" event'
            );
            clients
              .claim()
              .then(() => {
                logger.info("Promise clients.claim() resolved");
              })
              .catch((error) => {
                logger.error("Promise clients.claim() rejected", {
                  error: error instanceof Error ? error.message : String(error),
                });
                throw error;
              })
              .then(resolve);
          })
        );
      });
    }
    logger.info("Background initialization initiated.");
  } catch (error) {
    logger.error("Error during the initialization of the background", {
      error,
    });
    throw error;
  }
}
initBackground();
