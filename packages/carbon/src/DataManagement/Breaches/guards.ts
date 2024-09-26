import { is } from "ramda";
import { BaseDataModelObject } from "@dashlane/communication";
import {
  Breach,
  BreachContent,
  DataLeaksBreach,
  VersionedBreach,
  VersionedBreachContent,
} from "DataManagement/Breaches/types";
const isObject = (param: unknown): param is Object => is(Object, param);
function isVersionedBreachContent(
  content: unknown
): content is VersionedBreachContent {
  return isObject(content) && typeof content["breachModelVersion"] === "number";
}
export function isSupportedBreachContent(
  content: unknown
): content is BreachContent {
  return (
    isVersionedBreachContent(content) &&
    content.breachModelVersion === 1 &&
    Array.isArray(content["domains"]) &&
    typeof content["eventDate"] === "string" &&
    typeof content["id"] === "string"
  );
}
export function isSupportedBreach(breach: VersionedBreach): breach is Breach {
  return isBreach(breach) && isSupportedBreachContent(breach.Content);
}
export function isBreach(o: BaseDataModelObject): o is VersionedBreach {
  return Boolean(o) && o.kwType === "KWSecurityBreach";
}
function hasImpactedEmailsField(
  breachContent: BreachContent
): breachContent is BreachContent & {
  impactedEmails: string[];
} {
  return (
    "impactedEmails" in breachContent &&
    Array.isArray(breachContent["impactedEmails"])
  );
}
export function isDataLeaksBreachContent(
  breachContent: BreachContent
): boolean {
  return (
    hasImpactedEmailsField(breachContent) &&
    breachContent.impactedEmails.length > 0
  );
}
export const isDataLeaksBreach = (
  breach: VersionedBreach
): breach is DataLeaksBreach => {
  return isSupportedBreach(breach) && isDataLeaksBreachContent(breach.Content);
};
export const isPublicBreach = (breach: VersionedBreach): breach is Breach => {
  return isSupportedBreach(breach) && !isDataLeaksBreachContent(breach.Content);
};
