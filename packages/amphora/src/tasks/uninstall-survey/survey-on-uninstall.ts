import { runtimeSetUninstallURL } from "@dashlane/webextensions-apis";
import { DASHLANE_BASE_URL } from "../../constants/dashlane";
import { TaskDependencies } from "../../tasks/tasks.types";
import { logWarn } from "../../logs/console/logger";
export async function surveyOnUninstall({
  connectors: { extensionToCarbonApiConnector: carbonApiConnector },
}: TaskDependencies): Promise<void> {
  try {
    const uninstallFeedbackURL = new URL(`${DASHLANE_BASE_URL}/feedback`);
    const platformName = await carbonApiConnector.getPlatformName();
    uninstallFeedbackURL.searchParams.append("platform", platformName);
    const anonymousComputerId =
      await carbonApiConnector.getAnonymousComputerId();
    uninstallFeedbackURL.searchParams.append("aci", anonymousComputerId);
    runtimeSetUninstallURL(uninstallFeedbackURL.toString());
  } catch (error) {
    logWarn({
      details: { error },
      message: "Error on display of survey after extension removal",
      tags: ["amphora", "initBackground", "surveyOnUninstall"],
    });
  }
}
