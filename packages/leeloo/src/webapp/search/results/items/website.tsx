import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { Website as Item } from "@dashlane/vault-contracts";
import { logSelectPersonalInfo } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const WebsiteItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const website = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectPersonalInfo(website.id, ItemType.Website, index + 1, matchCount);
    closeSearch();
    redirect(routes.userPersonalInfoWebsite(website.id));
  };
  return (
    <BaseResultItem
      id={website.id}
      title={website.itemName}
      description={website.URL}
      onClick={onClick}
      thumbnail={<VaultItemThumbnail type="website" />}
    />
  );
};
