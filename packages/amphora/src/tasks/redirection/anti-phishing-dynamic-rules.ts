import { RuleWithoutId } from "./types";
import { encodeAntiPhishingToken } from "./helpers";
export function buildAntiPhishingDynamicRules(
  domains: string[],
  extensionHost: string,
  scheme: string,
  priority: number
): RuleWithoutId[] {
  return domains.map((domain) => {
    const escapedDomain = domain.replace(/[.]/g, "\\$&");
    return {
      priority,
      action: {
        type: "redirect" as chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          regexSubstitution: `${scheme}//${extensionHost}/index.html?token=${encodeAntiPhishingToken(
            domain
          )}#/anti-phishing`,
        },
      },
      condition: {
        regexFilter: `__REDACTED__${escapedDomain}.*$`,
        resourceTypes: [
          "main_frame" as chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
        ],
      },
    };
  });
}
