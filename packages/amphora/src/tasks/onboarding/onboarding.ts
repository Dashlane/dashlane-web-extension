import { tabsCreate } from "@dashlane/webextensions-apis";
import {
  CarbonApiEvents,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import { cookieRemoveByDomain } from "@dashlane/framework-infra/spi";
import { ExtensionCarbonConnector } from "../../communication/connectors.types";
async function openOnboardingSite(
  carbonLegacyConnector: ExtensionCarbonConnector,
  webOnboardingMode: WebOnboardingModeEvent
) {
  const site = webOnboardingMode.flowLoginCredentialOnWebSite;
  if (!site) {
    return;
  }
  await cookieRemoveByDomain(site.domain);
  await tabsCreate({ url: site.url });
  await carbonLegacyConnector.updateWebOnboardingMode({
    flowLoginCredentialOnWebSite: null,
  });
}
export function initOnboarding({
  connectors: {
    extensionToCarbonApiConnector,
    extensionToCarbonLegacyConnector,
  },
}: {
  connectors: {
    extensionToCarbonApiConnector: CarbonApiEvents;
    extensionToCarbonLegacyConnector: ExtensionCarbonConnector;
  };
}): void {
  extensionToCarbonApiConnector.liveWebOnboardingMode.on(
    (webOnboardingMode: WebOnboardingModeEvent) => {
      void openOnboardingSite(
        extensionToCarbonLegacyConnector,
        webOnboardingMode
      );
    }
  );
}
