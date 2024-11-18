import {
  runtimeGetURL,
  tabsUpdate,
  webRequestOnBeforeRequest,
} from "@dashlane/webextensions-apis";
import { ParsedURL } from "@dashlane/url-parser";
import { buildRedirectUrl } from "./build-redirect-url";
import { encodeAntiPhishingToken } from "./helpers";
import { CarbonApiEvents } from "@dashlane/communication";
import { logger } from "../../logs/app-logger";
export function makeAntiPhishingRedirectUrl(
  extensionUrl: string,
  phishingUrl: string
): string {
  return `${extensionUrl}?token=${encodeAntiPhishingToken(
    new ParsedURL(phishingUrl).getRootDomain()
  )}#/anti-phishing`;
}
function antiPhishingRedirectionHandler(
  requestDetails: chrome.webRequest.WebRequestBodyDetails
) {
  const { tabId, url: phishingUrl } = requestDetails;
  if (!tabId) {
    return {};
  }
  const dashlaneExtensionURL = runtimeGetURL("");
  const extensionUrl = buildRedirectUrl(dashlaneExtensionURL);
  void tabsUpdate(requestDetails.tabId, {
    url: makeAntiPhishingRedirectUrl(extensionUrl, phishingUrl),
  });
  return {};
}
function addAntiPhishingRedirectionPatterns(
  phishingDomains: Set<string>
): void {
  if (!phishingDomains.size) {
    return;
  }
  const patterns = Array.from(phishingDomains).reduce(
    (acc: string[], curr: string) => {
      const patternList = ["https", "http"].map(
        (scheme) => `${scheme}://*.${curr}/*`
      );
      acc.push(...patternList);
      return acc;
    },
    []
  );
  if (webRequestOnBeforeRequest.hasListener(antiPhishingRedirectionHandler)) {
    webRequestOnBeforeRequest.removeListener(antiPhishingRedirectionHandler);
  }
  webRequestOnBeforeRequest.addListener(antiPhishingRedirectionHandler, {
    urls: patterns,
    types: ["main_frame"],
  });
}
export function initAntiphishingRedirectionFallback(
  extensionToCarbonApiConnector: CarbonApiEvents
): void {
  extensionToCarbonApiConnector.livePhishingURLList.on(
    (newDomainList: Set<string>) => {
      logger.info(
        "Execute on carbon event antiPhishing change from carbon endpoint: livePhishingURLList"
      );
      addAntiPhishingRedirectionPatterns(newDomainList);
    }
  );
}
