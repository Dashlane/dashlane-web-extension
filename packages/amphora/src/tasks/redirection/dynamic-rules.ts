import { Mutex } from "async-mutex";
import {
  declarativeNetRequestGetDynamicRules,
  declarativeNetRequestUpdateDynamicRules,
  runtimeGetURL,
} from "@dashlane/webextensions-apis";
import { addRulesIds, getHost, getScheme } from "./helpers";
import { buildHostDynamicRules } from "./host-dynamic-rules";
import { buildAntiPhishingDynamicRules } from "./anti-phishing-dynamic-rules";
import { buildNoRedirectDynamicRules } from "./no-redirect-dynamic-rules";
import { logInfo } from "../../logs/console/logger";
import { CarbonApiEvents } from "@dashlane/communication";
async function getPreviousRulesIds(): Promise<number[]> {
  const previousRules = await declarativeNetRequestGetDynamicRules();
  return previousRules.map(
    (rule: chrome.declarativeNetRequest.Rule) => rule.id
  );
}
function buildDynamicRules(
  antiPhishingDomains: string[],
  lowestPriority: number
): chrome.declarativeNetRequest.Rule[] {
  const baseUrl = runtimeGetURL("");
  const extensionHost = getHost(baseUrl);
  const scheme = getScheme(baseUrl);
  const hostRedirectDynamicRules = buildHostDynamicRules(
    extensionHost,
    scheme,
    lowestPriority
  );
  const noRedirectRules = buildNoRedirectDynamicRules(lowestPriority + 1);
  const antiPhishingDynamicRules = buildAntiPhishingDynamicRules(
    antiPhishingDomains,
    extensionHost,
    scheme,
    lowestPriority + 2
  );
  return addRulesIds([
    ...hostRedirectDynamicRules,
    ...noRedirectRules,
    ...antiPhishingDynamicRules,
  ]);
}
const DYNAMIC_RULES_UPDATE_MUTEX = new Mutex();
async function replaceAllDynamicRules(antiPhishingDomains: string[]) {
  await DYNAMIC_RULES_UPDATE_MUTEX.runExclusive(async () => {
    const removeRuleIds = await getPreviousRulesIds();
    const addRules = buildDynamicRules(antiPhishingDomains, 1);
    void declarativeNetRequestUpdateDynamicRules({
      removeRuleIds,
      addRules,
    });
  });
}
export function initRedirection(
  extensionToCarbonApiConnector: CarbonApiEvents
): void {
  void replaceAllDynamicRules([]);
  extensionToCarbonApiConnector.livePhishingURLList.on(
    (antiPhishingDomainsList: Set<string>) => {
      logInfo({
        message:
          "Execute on carbon event antiPhishing change from carbon endpoint: livePhishingURLList",
        tags: ["amphora", "initBackground", "initRedirection"],
      });
      const antiPhishingDomains = Array.from(antiPhishingDomainsList);
      void replaceAllDynamicRules(antiPhishingDomains);
    }
  );
}
