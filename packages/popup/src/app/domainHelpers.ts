import { ParsedURL } from "@dashlane/url-parser";
export function extractValidDomainForTab(fullUrl: string): string {
  const parsedURL = new ParsedURL(fullUrl);
  return parsedURL.isUrlValid({ mustBeHttpOrHttps: true })
    ? parsedURL.getRootDomain()
    : "";
}
