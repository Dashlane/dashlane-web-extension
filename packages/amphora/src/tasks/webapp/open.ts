import { webappOpen } from "@dashlane/framework-infra/spi";
import { managedStorageGet } from "@dashlane/webextensions-apis";
import { SIGN_UP_URL_SEGMENT } from "../../constants/dashlane";
import { logInfo } from "../../logs/console/logger";
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
      logInfo({
        message: "Silent Deploy is set, the webapp will not be launched",
        tags: ["amphora", "initBackground", "open"],
      });
      return;
    }
  } catch {}
  void webappOpen({ route: SIGN_UP_URL_SEGMENT });
}
