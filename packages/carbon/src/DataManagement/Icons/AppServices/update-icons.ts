import { defaultTo, difference } from "ramda";
import {
  Credential,
  IconDataStructure,
  IconType,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { Breach } from "DataManagement/Breaches/types";
import {
  decryptIconsDomains,
  getFormattedDomainsFromUrls,
} from "DataManagement/Icons/AppServices/icons-domains";
import { iconsSelector } from "DataManagement/Icons/selectors";
import { State } from "Store";
import { IconDataWithDomain } from "Libs/WS/IconCrawler";
import { makeEmptyIconUrls } from "DataManagement/Icons/AppServices/icon-urls";
import { IconsGateway } from "DataManagement/Icons/Gateways/interfaces";
import { richIconsSettingSelector } from "Session/selectors";
export const getIconsUrlsForCredentials = (
  credentials: Credential[]
): (string | undefined)[] => credentials.map((credential) => credential.Url);
export const getIconsUrlsForBreaches = (breaches: Breach[]) =>
  breaches.reduce((urls, breach) => {
    const domains = breach.Content.domains;
    if (!domains || domains.length === 0) {
      return urls;
    }
    return [...urls, domains[0]];
  }, []);
export const fetchIconsForBreaches = async (
  state: State,
  iconsGateway: IconsGateway,
  breaches: Breach[],
  iconTypes: IconType[]
): Promise<IconDataWithDomain[]> => {
  const areRichIconsEnabled = richIconsSettingSelector(state);
  if (!areRichIconsEnabled) {
    return Promise.resolve([]);
  }
  const urls = getIconsUrlsForBreaches(breaches);
  const domains = getFormattedDomainsFromUrls(urls);
  const decryptedCachedIconsMap = decryptIconsDomains(
    iconsSelector(state),
    domains
  );
  const cachedDomains = Array.from(decryptedCachedIconsMap.keys());
  const newDomains = difference(domains, cachedDomains);
  return iconsGateway.getIcons(newDomains, iconTypes);
};
export const getCredentialsWithWebsiteIcon = (
  credentials: Credential[],
  iconsMap: Map<string, IconDataStructure>,
  types: IconType[]
): Credential[] => {
  const defaultDomainIcon: IconDataStructure = {
    backgroundColor: null,
    mainColor: null,
    urls: makeEmptyIconUrls(types),
  };
  return credentials.map((credential) => {
    const credentialsIcons = iconsMap.get(
      new ParsedURL(credential.Url).getRootDomain()
    );
    const domainIcon = defaultTo(defaultDomainIcon, credentialsIcons);
    return { ...credential, domainIcon };
  });
};
export const fetchIconsForCredentials = async (
  state: State,
  iconsGateway: IconsGateway,
  credentials: Credential[],
  iconTypes: IconType[]
): Promise<IconDataWithDomain[]> => {
  const areRichIconsEnabled = richIconsSettingSelector(state);
  if (!areRichIconsEnabled) {
    return [];
  }
  const urls = getIconsUrlsForCredentials(credentials);
  const domains = getFormattedDomainsFromUrls(urls);
  const decryptedCachedIconsMap = decryptIconsDomains(
    iconsSelector(state),
    domains
  );
  const cachedDomains = Array.from(decryptedCachedIconsMap.keys());
  const newDomains = difference(domains, cachedDomains);
  return iconsGateway.getIcons(newDomains, iconTypes);
};
export const fetchIconsForAllItems = async (
  iconsGateway: IconsGateway,
  credentials: Credential[],
  breaches: Breach[],
  iconTypes: IconType[]
): Promise<IconDataWithDomain[]> => {
  const urls = [
    ...getIconsUrlsForBreaches(breaches),
    ...getIconsUrlsForCredentials(credentials),
  ];
  const domains = getFormattedDomainsFromUrls(urls);
  return iconsGateway.getIcons(domains, iconTypes);
};
