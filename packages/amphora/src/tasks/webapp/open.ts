import { webappOpen } from "@dashlane/framework-infra/spi";
import { managedStorageGet } from "@dashlane/webextensions-apis";
import { SIGN_UP_URL_SEGMENT } from "../../constants/dashlane";
import { logger } from "../../logs/app-logger";
const SILENT_DEPLOY = "silent_deploy";
export async function open(): Promise<void> {
  try {
    const policies = await managedStorageGet();
    if (
      typeof policies === "object" &&
      policies !== null &&
      SILENT_DEPLOY in policies &&
      policies[SILENT_DEPLOY] === true
    ) {
      logger.info("Silent Deploy is set, the webapp will not be launched");
      return;
    }
  } catch {}
  void webappOpen({ route: SIGN_UP_URL_SEGMENT });
}
