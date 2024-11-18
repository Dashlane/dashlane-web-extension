import { logger } from "../logs/app-logger";
export function setupLoggingLifecycleEvents() {
  try {
    addEventListener("install", () => {
      logger.debug("Extension ServiceWorker installing");
    });
    addEventListener("activate", () => {
      logger.debug("Extension ServiceWorker activated");
    });
    chrome.runtime.onStartup?.addListener(() => {
      logger.debug("Browser profile startup");
    });
    chrome.runtime.onSuspend?.addListener(() => {
      logger.debug("Extension event page suspend event");
    });
    chrome.runtime.onSuspendCanceled?.addListener(() => {
      logger.debug("Extension event page suspend cancelled");
    });
    chrome.runtime.onUpdateAvailable?.addListener(() => {
      logger.debug("Extension update available");
    });
    chrome.runtime.onRestartRequired?.addListener(() => {
      logger.debug("Browser update available");
    });
    chrome.runtime.onBrowserUpdateAvailable?.addListener(() => {
      logger.debug("Browser update available");
    });
    chrome.runtime.onRestartRequired?.addListener((reason) => {
      logger.debug("Restart required by browser", {
        reason,
      });
    });
    if ((chrome.extension as any)?.isIncognitoContext) {
      logger.debug("Is in incognito context");
    }
    chrome.idle?.onStateChanged?.addListener((state) => {
      logger.debug("Idle state changed", {
        state,
      });
    });
    (chrome.runtime as any).onPerformanceWarning?.addListener(
      (details: {
        category: "content_script";
        severity: "low" | "medium" | "high";
        tabId: number;
        description: string;
      }) => {
        const { category, severity, tabId, description } = details;
        logger.debug("Performance warning emitted for the extension", {
          category,
          severity,
          tabId,
          description,
        });
      }
    );
    chrome.runtime.onInstalled?.addListener((params) => {
      const { reason } = params;
      if (reason === "install") {
        logger.debug("Extension got installed");
      } else if (reason === "update") {
        const { previousVersion } = params;
        logger.debug("Extension got updated", {
          previousVersion: previousVersion ?? "",
        });
      } else if (reason === "chrome_update") {
        logger.debug("Chrome got updated");
      } else if ((reason as string) === "browser_update") {
        logger.debug("Browser got updated");
      } else if ((reason as string) === "shared_module_update") {
        const { id: sharedModuleId } = params;
        logger.debug("A shared module got updated", {
          sharedModuleId: sharedModuleId ?? "",
        });
      }
      if (
        (
          params as unknown as {
            temporary: boolean;
          }
        ).temporary
      ) {
        logger.debug("Extension is installed temporarily");
      }
    });
  } catch (err) {
    logger.error("Failed setting up extension lifecycle event logs", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
