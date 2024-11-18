import { runtimeReload } from "@dashlane/webextensions-apis";
import { ExtensionCarbonConnector } from "../../communication/connectors.types";
import { logger } from "../../logs/app-logger";
export function reloadOnLogout({
  connectors: { carbonToExtensionLegacyConnector },
}: {
  connectors: {
    carbonToExtensionLegacyConnector: ExtensionCarbonConnector;
  };
}): void {
  carbonToExtensionLegacyConnector.reloadExtension.on(async (isSessionOpen) => {
    try {
      if (!isSessionOpen) {
        runtimeReload();
      }
    } catch (error) {
      logger.error("Error while reloading extension", { error });
      throw error;
    }
  });
}
