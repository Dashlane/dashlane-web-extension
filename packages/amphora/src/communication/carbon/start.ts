import { CANCEL_DISCOUNTS_AB_TEST } from "@dashlane/plans-contracts";
import { CoreServices, init } from "@dashlane/carbon";
import { getPlatformInfo } from "./platform-info";
import { serverApiKeys } from "./server-api-keys";
import { StartParams } from "./start.types";
import { config as carbonConfig } from "./carbon-config";
import { logger } from "../../logs/app-logger";
export async function startCarbon({
  apiConnector,
  debugConnector,
  infrastructureConnectors,
  legacyExtensionConnector,
  legacyWebappConnector,
  legacyMaverickConnector,
  publicPath,
  storageLayer,
  sessionStorage,
  app,
}: StartParams): Promise<CoreServices> {
  logger.debug(`Carbon initialization started`);
  const platformInfo = await getPlatformInfo();
  const coreServices = await init({
    connectors: {
      api: apiConnector,
      debug: debugConnector,
      extension: legacyExtensionConnector,
      leeloo: legacyWebappConnector,
      maverick: legacyMaverickConnector,
    },
    infrastructure: {
      connectors: infrastructureConnectors,
    },
    platformInfo,
    publicPath,
    storageLayer,
    sessionStorage,
    keys: serverApiKeys,
    config: carbonConfig,
    settings: {
      sync: {
        syncWithLocalClients: true,
      },
      userABTestNames: ["ace_password_health_labels", CANCEL_DISCOUNTS_AB_TEST],
    },
    createClients: app.createClient,
  });
  logger.debug(`Carbon initialization done`);
  return coreServices;
}
