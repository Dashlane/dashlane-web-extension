import { ParsedURL } from "@dashlane/url-parser";
export const isAmazonWebsite = (url: string): boolean => {
  return new ParsedURL(url).getRootDomainName() === "amazon";
};
