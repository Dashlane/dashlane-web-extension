import {
  scriptingExecuteScript,
  storageLocalGet,
  tabsQuery,
} from "@dashlane/webextensions-apis";
import { logError } from "../../logs/console/logger";
const INJECTED_FILES_PATHS = [
  "/content/injectedts/vendors.js",
  "/content/contentScripts/kwift.CHROME.js",
];
const INJECT_SCRIPT_ON_START_OPTIONS_KEY = "options.useInjectScriptOnStart";
export async function getTabsAndInjectScript(): Promise<void> {
  try {
    const isFeatureEnabled = await storageLocalGet(
      INJECT_SCRIPT_ON_START_OPTIONS_KEY
    );
    if (isFeatureEnabled[INJECT_SCRIPT_ON_START_OPTIONS_KEY]) {
      const tabs = await tabsQuery({
        url: ["*****", "*****"],
      });
      tabs.forEach(({ id: tabId }: chrome.tabs.Tab) => {
        if (!tabId) {
          return;
        }
        void scriptingExecuteScript({
          target: { tabId, allFrames: true },
          files: INJECTED_FILES_PATHS,
        });
      });
    }
  } catch (error) {
    logError({
      message: "Failed to inject script on existing tabs",
      details: { error },
      tags: ["amphora", "initBackground", "getTabsAndInjectScript"],
    });
    throw error;
  }
}
export function injectScriptOnExistingTabs(): void {
  void getTabsAndInjectScript();
}
