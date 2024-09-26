import { defaultTo } from "ramda";
import {
  BreachDetailItemView,
  BreachItemView,
  IconDataStructure,
} from "@dashlane/communication";
import { Breach, BreachContent } from "DataManagement/Breaches/types";
import { breachTypeMapper } from "DataManagement/Breaches/mappers";
import { isDataLeaksBreach } from "DataManagement/Breaches/guards";
import { IconDomains } from "Session/Store/Icons";
import { getIcon } from "DataManagement/Icons/get-icons";
const defaultToEmptyArray = defaultTo([]);
function getBreachName({ name, domains }: BreachContent): string {
  if (name) {
    return name;
  }
  if (domains.length > 0) {
    const [firstDomain] = domains;
    return firstDomain;
  }
  return "";
}
function getBreachIcon(
  icons: IconDomains,
  domains: string[] | undefined
): IconDataStructure | undefined {
  if (!domains || domains.length === 0) {
    return undefined;
  }
  return getIcon(icons)(domains[0]);
}
export function detailItemView(
  icons: IconDomains,
  breach: Breach
): BreachDetailItemView {
  const content = breach.Content;
  const impactedEmails = isDataLeaksBreach(breach)
    ? breach.Content.impactedEmails
    : [];
  const compromisedCredentialsIds = new Set<string>();
  return {
    breachType: breachTypeMapper(breach),
    domains: defaultToEmptyArray(content.domains),
    domainIcon: getBreachIcon(icons, breach.Content.domains),
    eventDate: content.eventDate,
    id: breach.Id,
    impactedEmails: impactedEmails,
    kwType: breach.kwType,
    leakedData: defaultToEmptyArray(content.leakedData),
    leakedPasswords: defaultToEmptyArray(breach.LeakedPasswords),
    name: getBreachName(content),
    status: breach.Status,
    compromisedCredentialIds: [...compromisedCredentialsIds],
  };
}
export function itemView(icons: IconDomains, breach: Breach): BreachItemView {
  const content = breach.Content;
  const impactedEmails = isDataLeaksBreach(breach)
    ? breach.Content.impactedEmails
    : [];
  return {
    domains: defaultToEmptyArray(content.domains),
    breachType: breachTypeMapper(breach),
    domainIcon: getBreachIcon(icons, breach.Content.domains),
    eventDate: content.eventDate,
    id: breach.Id,
    impactedEmails: impactedEmails,
    name: getBreachName(content),
    status: breach.Status,
  };
}
export function listView(
  icons: IconDomains,
  breaches: Breach[]
): BreachItemView[] {
  return breaches.map((breach) => itemView(icons, breach));
}
