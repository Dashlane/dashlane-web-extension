import { RuleWithoutId } from "./types";
const NO_REDIRECT_FILTER = "__REDACTED__";
const CDN_NO_REDIRECT_FILTER = "__REDACTED__";
export function buildNoRedirectDynamicRules(priority: number): RuleWithoutId[] {
  return [
    {
      priority,
      action: {
        type: "allowAllRequests" as chrome.declarativeNetRequest.RuleActionType,
      },
      condition: {
        regexFilter: CDN_NO_REDIRECT_FILTER,
        resourceTypes: [
          "main_frame" as chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
        ],
      },
    },
    {
      priority,
      action: {
        type: "allowAllRequests" as chrome.declarativeNetRequest.RuleActionType,
      },
      condition: {
        regexFilter: NO_REDIRECT_FILTER,
        resourceTypes: [
          "main_frame" as chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
        ],
      },
    },
  ];
}
