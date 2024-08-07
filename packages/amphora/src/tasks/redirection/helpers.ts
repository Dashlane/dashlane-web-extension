import { RuleWithoutId } from "./types";
const FIRST_RULE_ID = 1;
export function addRulesIds(
  rules: RuleWithoutId[]
): chrome.declarativeNetRequest.Rule[] {
  return rules.map((rule, index) => ({
    id: index + FIRST_RULE_ID,
    ...rule,
  }));
}
export function getHost(url: string): string {
  return new URL(url).hostname;
}
export function getScheme(url: string): string {
  return new URL(url).protocol;
}
export function encodeAntiPhishingToken(phishingDomain: string): string {
  return btoa(encodeURIComponent(phishingDomain));
}
