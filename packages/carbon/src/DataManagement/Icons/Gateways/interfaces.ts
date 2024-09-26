import { IconType } from "@dashlane/communication";
import { IconDataWithDomain } from "Libs/WS/IconCrawler";
export interface IconsGateway {
  getIcons: (
    domains: string[],
    iconTypes: IconType[]
  ) => Promise<IconDataWithDomain[]>;
}
