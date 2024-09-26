import { IconType, IconUrls } from "@dashlane/communication";
import { DomainIcon } from "Libs/WS/IconCrawler";
export const computeIconUrls = (
  domainIcons: DomainIcon[],
  iconTypes: IconType[]
): IconUrls =>
  iconTypes.reduce((urls, type) => {
    const icon = domainIcons.find((icon) => icon && icon.type === type);
    urls[type] = icon ? icon.url : null;
    return urls;
  }, <IconUrls>{});
export const makeEmptyIconUrls = (iconTypes: IconType[]): IconUrls =>
  computeIconUrls([], iconTypes);
