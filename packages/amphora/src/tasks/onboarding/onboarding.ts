import { tabsCreate } from "@dashlane/webextensions-apis";
import { WebOnboardingModeEvent } from "@dashlane/communication";
import { cookieRemoveByDomain } from "@dashlane/framework-infra/spi";
import { ExtensionCarbonConnector } from "../../communication/connectors.types";
import { TaskDependencies } from "../tasks.types";
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
    extensionToCarbonApiConnector: carbonApiConnector,
    extensionToCarbonLegacyConnector: carbonLegacyConnector,
  },
}: TaskDependencies): void {
  carbonApiConnector.liveWebOnboardingMode.on(
    (webOnboardingMode: WebOnboardingModeEvent) => {
      void openOnboardingSite(carbonLegacyConnector, webOnboardingMode);
    }
  );
}
