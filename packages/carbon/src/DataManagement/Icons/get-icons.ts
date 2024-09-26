import { ParsedURL } from "@dashlane/url-parser";
import { IconDomains } from "Session/Store/Icons";
import { computeHashMD5 } from "Libs/CryptoCenter/Primitives/Hash";
export const getIcon = (icons: IconDomains) => (url: string) => {
  const domain = new ParsedURL(url).getRootDomain();
  if (!domain) {
    return undefined;
  }
  const hash = computeHashMD5(domain);
  return icons.get(hash);
};
