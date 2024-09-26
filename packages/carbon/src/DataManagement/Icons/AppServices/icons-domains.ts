import { uniq } from "ramda";
import { IconDataStructure } from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { IconDomains } from "Session/Store/Icons";
import { computeHashMD5 } from "Libs/CryptoCenter/Primitives/Hash";
export const decryptIconsDomains = (
  hashedIconDomains: IconDomains,
  domains: string[]
): Map<string, IconDataStructure> => {
  const cacheDomainHashes = Array.from(hashedIconDomains.keys());
  const cacheDecryptedMap = new Map();
  const domainsHashes: {
    [hash: string]: string;
  } = domains.reduce((acc, domain) => {
    const hash = computeHashMD5(domain);
    acc[hash] = domain;
    return acc;
  }, {});
  cacheDomainHashes.forEach((hash) => {
    const decryptedDomainName = domainsHashes[hash];
    cacheDecryptedMap.set(decryptedDomainName, hashedIconDomains.get(hash));
  });
  return cacheDecryptedMap;
};
export const getFormattedDomainsFromUrls = (urls: (string | undefined)[]) => {
  return uniq(urls.map((url) => new ParsedURL(url).getRootDomain())).filter(
    (domain) => typeof domain === "string" && domain.length
  );
};
