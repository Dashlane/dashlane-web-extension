import { runtimeSetUninstallURL } from "@dashlane/webextensions-apis";
import { DASHLANE_BASE_URL } from "../../constants/dashlane";
import { CarbonApiEvents } from "@dashlane/communication";
import { logger } from "../../logs/app-logger";
export async function surveyOnUninstall({
  connectors: { extensionToCarbonApiConnector },
}: {
  connectors: {
    extensionToCarbonApiConnector: CarbonApiEvents;
  };
}): Promise<void> {
  try {
    const uninstallFeedbackURL = new URL(`${DASHLANE_BASE_URL}/feedback`);
    const platformName = await extensionToCarbonApiConnector.getPlatformName();
    uninstallFeedbackURL.searchParams.append("platform", platformName);
    const anonymousComputerId =
      await extensionToCarbonApiConnector.getAnonymousComputerId();
    uninstallFeedbackURL.searchParams.append("aci", anonymousComputerId);
    runtimeSetUninstallURL(uninstallFeedbackURL.toString());
  } catch (error) {
    logger.warn("Error on display of survey after extension removal", {
      error,
    });
  }
}
