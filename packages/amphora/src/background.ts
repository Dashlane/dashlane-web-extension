import {
  declarativeNetRequestIsSupported,
  storageSessionIsSupported,
} from "@dashlane/webextensions-apis";
import { startCarbon } from "./communication/carbon/start";
import {
  makeSessionStorageLayer as makeCarbonSessionStorageLayer,
  makeStorageLayer as makeCarbonStorageLayer,
} from "./communication/carbon/storage-layer";
import { logError, logInfo } from "./logs/console/logger";
import { makeConnectors } from "./communication/connectors";
import { Connectors } from "./communication/connectors.types";
import { isServiceWorker } from "./lifecycle/service-worker/is-service-worker";
import { onInstall as onExtensionInstall } from "./lifecycle/extension/on-install";
import { onFirstInstall as onExtensionFirstInstall } from "./lifecycle/extension/on-first-install";
import { onStart as onExtensionStart } from "./lifecycle/extension/on-start";
import { onUpdate as onExtensionUpdate } from "./lifecycle/extension/on-update";
import {
  makeRunTasksAfterAppClientReady,
  makeRunTasksBeforeAppClientReady,
} from "./tasks/tasks";
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
const DASHLANE_CHROME_NIGHTLY_ID = "*****";
const DASHLANE_CHROME_BETA_ID = "*****";
const nightlyBetaOrDev =
  process.env.NODE_ENV === "*****" ||
  chrome.runtime.id === DASHLANE_CHROME_NIGHTLY_ID ||
  chrome.runtime.id === DASHLANE_CHROME_BETA_ID;
async function startCarbonAndModules(connectors: Connectors) {
  const carbonStorageLayer = makeCarbonStorageLayer();
  const sessionStorage = storageSessionIsSupported()
    ? makeCarbonSessionStorageLayer()
    : undefined;
  const { app, signalCarbonReady } = await startApplicationModules();
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
  return app;
}
function initBackground() {
  try {
    logInfo({
      message: "Background initialization started",
      tags: ["amphora", "initBackground"],
    });
    logInfo({
      message: "Create connectors",
      tags: ["amphora", "initBackground", "makeConnectors"],
    });
    const connectors = makeConnectors();
    logInfo({
      message: "Set appClientPromise with carbon and modules",
      tags: ["amphora", "initBackground", "startCarbonAndModules"],
    });
    const appClientPromise = startCarbonAndModules(connectors)
      .then((app) => app.createClient())
      .catch((error) => {
        logError({
          message: "appClientPromise rejected",
          details: { error },
          tags: ["amphora", "initBackground", "startCarbonAndModules"],
        });
        return Promise.reject(error);
      });
    logInfo({
      message:
        "Create runTasksAfterAppClientReady to execute tasks that require appClient promise to be resovled is created",
      tags: ["amphora", "initBackground", "makeRunTasksAfterAppClientReady"],
    });
    const runTasksAfterAppClientReady = makeRunTasksAfterAppClientReady(
      connectors,
      appClientPromise
    );
    logInfo({
      message:
        "Create runTasksBeforeAppClientReady to execute tasks that don't require appClient promise to be resovled",
      tags: ["amphora", "initBackground", "makeRunTasksBeforeAppClientReady"],
    });
    const runTasksBeforeAppClientReady = makeRunTasksBeforeAppClientReady(
      connectors,
      appClientPromise
    );
    logInfo({
      message: "Set redirection tasks",
      tags: ["amphora", "initBackground", "redirectionTasks"],
    });
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
      logInfo({
        message: "Initilialize debug logger",
        tags: [
          "amphora",
          "initBackground",
          "onExtensionStart",
          "initDebugLogger",
        ],
      });
      initDebugLogger(connectors.carbonDebugConnector);
      logInfo({
        message: "Initilialize argon",
        tags: [
          "amphora",
          "initBackground",
          "onExtensionStart",
          "argonInitializationFn",
        ],
      });
      const argonInitializationFn = isServiceWorker()
        ? initArgonForServiceWorker
        : initArgon;
      argonInitializationFn();
      logInfo({
        message:
          "Start tasks that don't require appClient promise to be resolved",
        tags: [
          "amphora",
          "initBackground",
          "onExtensionStart",
          "runTasksBeforeAppClientReady",
        ],
      });
      runTasksBeforeAppClientReady([reloadOnLogout, initAutofillEngine]);
      logInfo({
        message: "Start tasks that require appClient promise to be resolved",
        tags: [
          "amphora",
          "initBackground",
          "onExtensionStart",
          "runTasksAfterAppClientReady",
        ],
      });
      runTasksAfterAppClientReady([
        initOnboarding,
        surveyOnUninstall,
        initToolbarIcon,
        initToolbarIconBadge,
        initTiresias,
      ]);
    });
    onExtensionFirstInstall(() => {
      logInfo({
        message:
          "Start tasks logWebAppFirstLaunch and openWebAppSignUp in the first install",
        tags: ["amphora", "initBackground", "onExtensionFirstInstall"],
      });
      runTasksAfterAppClientReady([logWebAppFirstLaunch, openWebAppSignUp]);
    });
    onExtensionInstall(() => {
      logInfo({
        message: "Disable browser native autofill",
        tags: ["amphora", "initBackground", "onExtensionInstall"],
      });
      disableBrowserNativeAutofill();
    });
    onExtensionUpdate(() => {
      logInfo({
        message: "Inject script on existing tabs",
        tags: ["amphora", "initBackground", "onExtensionUpdate"],
      });
      runTasksAfterAppClientReady([injectScriptOnExistingTabs]);
    });
    chrome.runtime.onStartup.addListener(() => {
      logInfo({
        message: "chrome.runtime.onStartup event",
        tags: ["amphora", "initBackground"],
      });
    });
    const chromeMV3MagicTricksEnabled = true;
    if (
      "serviceWorker" in self &&
      self instanceof ServiceWorkerGlobalScope &&
      chromeMV3MagicTricksEnabled
    ) {
      logInfo({
        message: "Attaching Chrome MV3 Service Worker event handlers ...",
        tags: ["amphora", "initBackground", "chrome-mv3-service-worker"],
      });
      const skipWaiting = self.skipWaiting;
      const clients = self.clients;
      self.oninstall = () => {
        logInfo({
          message: "self.oninstall event",
          tags: [
            "amphora",
            "initBackground",
            "chrome-mv3-service-worker",
            "self.oninstall",
          ],
        });
        skipWaiting()
          .then(() => {
            logInfo({
              message: "Promise skipWaiting() resolved",
              tags: [
                "amphora",
                "initBackground",
                "chrome-mv3-service-worker",
                "self.oninstall",
                "skipWaiting",
              ],
            });
          })
          .catch((error) => {
            logError({
              message: "Promise skipWaiting() rejected",
              details: { error },
              tags: [
                "amphora",
                "initBackground",
                "chrome-mv3-service-worker",
                "self.oninstall",
                "skipWaiting",
              ],
            });
            throw error;
          });
      };
      self.addEventListener("activate", (event: ExtendableEvent) => {
        logInfo({
          message: "'activate' event triggered",
          tags: [
            "amphora",
            "initBackground",
            "chrome-mv3-service-worker",
            "self.addEventListener('activate')",
          ],
        });
        event.waitUntil(
          new Promise((resolve) => {
            logInfo({
              message: "ExtendableEvent.waitUntil() pending",
              tags: [
                "amphora",
                "initBackground",
                "chrome-mv3-service-worker",
                "self.addEventListener('activate')",
                "event.waitUntil",
              ],
            });
            clients
              .claim()
              .then(() => {
                logInfo({
                  message: "Promise clients.claim() resolved",
                  tags: [
                    "amphora",
                    "initBackground",
                    "chrome-mv3-service-worker",
                    "self.addEventListener('activate')",
                    "clients.claim()",
                  ],
                });
              })
              .catch((error) => {
                logError({
                  message: "Promise clients.claim() rejected",
                  details: { error },
                  tags: [
                    "amphora",
                    "initBackground",
                    "chrome-mv3-service-worker",
                    "self.addEventListener('activate')",
                    "clients.claim()",
                  ],
                });
                throw error;
              })
              .then(resolve);
          })
        );
      });
    }
    logInfo({
      message: "Background initialization done",
      tags: ["amphora", "initBackground"],
    });
  } catch (error) {
    logError({
      message: "Error during the initialization of the background",
      details: { error },
      tags: ["amphora", "initBackground"],
    });
    throw error;
  }
}
initBackground();
