import { IconType } from "@dashlane/communication";
import { IconsGateway } from "DataManagement/Icons/Gateways/interfaces";
import { WSService } from "Libs/WS";
import { IconDataWithDomain } from "Libs/WS/IconCrawler";
import {
  formatFetchedIcons,
  getDomainsIconsToBeFetched,
} from "DataManagement/Icons/Gateways/helpers";
import { isWSResponseSuccess } from "Libs/WS/helpers";
export class IconsWS implements IconsGateway {
  constructor(private wsService: WSService) {}
  public async getIcons(
    domains: string[],
    iconTypes: IconType[]
  ): Promise<IconDataWithDomain[]> {
    if (!domains || !domains.length) {
      return [];
    }
    const iconsToBeFetched = getDomainsIconsToBeFetched(domains, iconTypes);
    const response = await this.wsService.iconCrawler.getIcons(
      iconsToBeFetched
    );
    if (!isWSResponseSuccess(response)) {
      const errorMsg =
        `[Icons] getIcons: ${response.message}` +
        `(statusCode: ${response.code})`;
      throw new Error(errorMsg);
    }
    const { content: fetchedIcons } = response;
    return formatFetchedIcons(fetchedIcons, iconTypes, domains.length);
  }
}
