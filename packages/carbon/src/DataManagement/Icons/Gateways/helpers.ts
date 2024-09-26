import { defaultTo, head } from "ramda";
import { IconType } from "@dashlane/communication";
import {
  DomainIcon,
  DomainInfo,
  IconDataWithDomain,
} from "Libs/WS/IconCrawler";
import { computeIconUrls } from "DataManagement/Icons/AppServices/icon-urls";
const defaultToNull = defaultTo(null);
export const getDomainIconsToBeFetched = (
  domain: string,
  types: IconType[]
): DomainInfo[] =>
  types.reduce(
    (result, type) => [
      ...result,
      {
        domain,
        type,
      },
    ],
    []
  );
export const getDomainsIconsToBeFetched = (
  domains: string[],
  types: IconType[]
): DomainInfo[] => {
  return domains.reduce(
    (result, domain) => [
      ...result,
      ...getDomainIconsToBeFetched(domain, types),
    ],
    []
  );
};
export const makeIconDataWithDomain = (
  iconsArray: DomainIcon[],
  iconTypes: IconType[]
): IconDataWithDomain => {
  const iconData = head(iconsArray) || {};
  return {
    urls: computeIconUrls(iconsArray, iconTypes),
    backgroundColor: defaultToNull(iconData.backgroundColor),
    mainColor: defaultToNull(iconData.mainColor),
    domain: defaultToNull(iconData.domain),
  };
};
export const formatFetchedIcons = (
  iconsByDomain: DomainIcon[],
  iconTypes: IconType[],
  domainsCount: number
): IconDataWithDomain[] => {
  const iconsCounter = iconTypes.length;
  return [...Array(domainsCount)].reduce((iconUrls, _, index) => {
    const domainIconsStart = index * iconsCounter;
    const domainIconsEnd = domainIconsStart + iconsCounter;
    const domainAssociatedIcons = iconsByDomain.slice(
      domainIconsStart,
      domainIconsEnd
    );
    return [
      ...iconUrls,
      makeIconDataWithDomain(domainAssociatedIcons, iconTypes),
    ];
  }, []);
};
