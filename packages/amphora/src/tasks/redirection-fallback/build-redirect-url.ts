import { runtimeGetURL } from "@dashlane/webextensions-apis";
export function buildRedirectUrl(url: string): string {
  const { hostname, hash, search } = new URL(url);
  const path = hostname.includes("*****")
    ? `index.html${search}#/console${hash.replace("#", "/").replace("//", "/")}`
    : `index.html${search}${hash.replace("#", "#/").replace("//", "/")}`;
  return runtimeGetURL(path);
}
