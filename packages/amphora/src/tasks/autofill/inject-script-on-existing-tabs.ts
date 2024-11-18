import {
  scriptingExecuteScript,
  storageLocalGet,
  tabsQuery,
} from "@dashlane/webextensions-apis";
import { logger } from "../../logs/app-logger";
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
        url: ["__REDACTED__", "__REDACTED__"],
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
    logger.error("Failed to inject script on existing tabs", { error });
    throw error;
  }
}
export function injectScriptOnExistingTabs(): void {
  void getTabsAndInjectScript();
}
