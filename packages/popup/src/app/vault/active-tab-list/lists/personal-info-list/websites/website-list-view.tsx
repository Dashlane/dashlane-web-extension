import { memo } from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { jsx } from "@dashlane/ui-components";
import { VaultItemType, Website } from "@dashlane/vault-contracts";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export interface WebsiteProps {
  item: Website;
}
const WebsiteComponent = ({ item }: WebsiteProps) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { id, spaceId, itemName, URL } = item;
  const openWebsiteDetailView = () => {
    logSelectVaultItem(id, ItemType.Website);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.Website, id);
  };
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="website" />}
      itemSpaceId={spaceId}
      title={itemName}
      subtitle={URL}
      onClick={openWebsiteDetailView}
    />
  );
};
export const WebsiteListView = memo(WebsiteComponent);
