import * as React from "react";
import { Redirect, useLocation } from "../../router";
const getClientAliases = (): Aliases => ({
  "/account-recovery/admin-assisted-recovery/change-master-password": [
    "/master-password-reset",
  ],
  "/credentials/add": ["/passwords/new"],
  "/credentials": ["/passwords"],
  "/credentials/account-settings": ["/account-settings"],
  "/credentials/account-settings?view=devices": ["/devices"],
  "/credentials/account-settings?view=security-settings": [
    "/security-settings",
  ],
  "/darkweb-monitoring": ["/dark-web-monitoring", "/security-dashboard"],
  "/ids": ["/id-documents"],
  "/ids/driver-licenses/add": ["/driver-licenses/new"],
  "/ids/driver-licenses": ["/driver-licenses"],
  "/ids/fiscal-ids/add": ["/fiscals/new"],
  "/ids/fiscal-ids": ["/fiscals"],
  "/ids/id-cards/add": ["/id-cards/new"],
  "/ids/id-cards": ["/id-cards"],
  "/ids/passports/add": ["/passports/new"],
  "/ids/passports": ["/passports"],
  "/ids/social-security-ids/add": ["/social-security-numbers/new"],
  "/ids/social-security-ids": ["/social-security-numbers"],
  "/notifications": ["/sharing"],
  "/onboarding": ["/getting-started"],
  "/payments/bank-account/add": ["/bank-accounts/new"],
  "/payments/bank-account": ["/bank-accounts"],
  "/payments/card/add": ["/credit-cards/new"],
  "/payments/card": ["/credit-cards"],
  "/personal-info/addresses/add": ["/addresses/new"],
  "/personal-info/addresses": ["/addresses"],
  "/personal-info/companies/add": ["/companies/new"],
  "/personal-info/companies": ["/companies"],
  "/personal-info/emails/add": ["/emails/new"],
  "/personal-info/emails": ["/emails"],
  "/personal-info/identities/add": ["/identities/new"],
  "/personal-info/identities": ["/identities"],
  "/personal-info/phones/add": ["/phones/new"],
  "/personal-info/phones": ["/phones"],
  "/personal-info/websites/add": ["/websites/new"],
  "/personal-info/websites": ["/websites"],
  "/secure-notes/add": ["/notes/new"],
  "/secure-notes": ["/notes"],
  "/login?askmp": ["/askmp"],
});
interface Aliases {
  [key: string]: string[];
}
interface AliasProps {
  basePath: string;
  aliases: Aliases;
}
const buildPath = (aliases: Aliases, basePath = "") =>
  Object.values(aliases)
    .flat()
    .map((path) => `${basePath}${path}`);
const getAliasRedirect = (aliases: Aliases, pathname: string) => {
  const match = Object.entries(aliases).reduce((memo, entry) => {
    if (memo) {
      return memo;
    }
    const [route, entryAliases] = entry;
    const alias = entryAliases.find((entryAlias) =>
      pathname.startsWith(entryAlias)
    );
    return alias ? { route, alias } : null;
  }, null);
  return match ? pathname.replace(match.alias, match.route) : null;
};
export const Alias = (props: AliasProps) => {
  const location = useLocation();
  const redirectPathname = getAliasRedirect(
    props.aliases,
    location.pathname.replace(props.basePath ?? "", "")
  );
  const redirectUrl = redirectPathname
    ? `${props.basePath}${redirectPathname}${location.search}`
    : null;
  return redirectUrl ? <Redirect to={redirectUrl} /> : null;
};
export const buildClientProps = (basePath = "") => {
  return {
    basePath,
    path: buildPath(getClientAliases(), basePath),
    aliases: getClientAliases(),
  };
};
