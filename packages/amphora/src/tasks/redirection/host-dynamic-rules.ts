import { RuleWithoutId } from "./types";
const APP_REGEX_FILTER = "__REDACTED__";
const CONSOLE_REGEX_FILTER = "__REDACTED__";
export const NITRO_REGEX_FILTER = "__REDACTED__";
export function buildHostDynamicRules(
  extensionHost: string,
  scheme: string,
  priority: number
): RuleWithoutId[] {
  return [
    {
      priority,
      action: {
        type: "redirect" as chrome.declarativeNetRequest.RuleActionType,
        redirect: {
          regexSubstitution: `${scheme}//${extensionHost}/index.html\\1#/\\2`,
        },
      },
      condition: {
        regexFilter: APP_REGEX_FILTER,
        resourceTypes: [
          "main_frame" as chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
        ],
      },
    },
    {
      priority,
      action: {
        type: "redirect" as chrome.declarativeNetRequest.RuleActionType,
        redirect: {
          regexSubstitution: `${scheme}//${extensionHost}/index.html\\1#/console/\\2`,
        },
      },
      condition: {
        regexFilter: CONSOLE_REGEX_FILTER,
        resourceTypes: [
          "main_frame" as chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
        ],
      },
    },
    {
      priority: priority + 1,
      action: {
        type: "redirect" as chrome.declarativeNetRequest.RuleActionType,
        redirect: {
          regexSubstitution: `${scheme}//${extensionHost}/loading.html`,
        },
      },
      condition: {
        regexFilter: NITRO_REGEX_FILTER,
        resourceTypes: [
          "main_frame" as chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
          "sub_frame" as chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
        ],
      },
    },
  ];
}
