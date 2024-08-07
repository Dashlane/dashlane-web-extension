import {
  runtimeReload,
  storageSessionGet,
  storageSessionIsSupported,
  storageSessionRemove,
  storageSessionSet,
} from "@dashlane/webextensions-apis";
import { SyncTaskDependencies } from "../tasks.types";
import { logError, logInfo } from "../../logs/console/logger";
const WAS_LOGGED_IN_KEY = "amphora.wasSessionOpen";
let previousIsSessionOpen = false;
async function getPreviousSessionOpenState() {
  if (storageSessionIsSupported()) {
    return !!(await storageSessionGet(WAS_LOGGED_IN_KEY));
  }
  return previousIsSessionOpen;
}
async function setPreviousSessionOpenState(value: boolean) {
  previousIsSessionOpen = value;
  if (storageSessionIsSupported()) {
    if (value) {
      return await storageSessionSet({ [WAS_LOGGED_IN_KEY]: "true" });
    }
    return await storageSessionRemove([WAS_LOGGED_IN_KEY]);
  }
}
export function reloadOnLogout({
  connectors: { extensionToCarbonApiConnector: carbonApiConnector },
}: SyncTaskDependencies): void {
  carbonApiConnector.liveDidOpen.on(async (isSessionOpen: boolean) => {
    logInfo({
      details: { isSessionOpen },
      message:
        "Changes on the session opened status (liveDidOpen) from carbon triggered, start syncing of extension state to match",
      tags: ["amphora", "initBackground", "reloadOnLogout"],
    });
    try {
      const wasOpen = await getPreviousSessionOpenState();
      await setPreviousSessionOpenState(isSessionOpen);
      if (wasOpen && !isSessionOpen) {
        runtimeReload();
      }
    } catch (error) {
      logError({
        message:
          "Error while syncing session opened status from carbon and current extension state",
        details: { error },
        tags: ["amphora", "initBackground", "reloadOnLogout"],
      });
      throw error;
    }
  });
}
