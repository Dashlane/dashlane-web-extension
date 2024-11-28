import { memo } from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { jsx } from "@dashlane/ui-components";
import { Email, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export interface Props {
  item: Email;
}
const EmailComponent = ({ item }: Props) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { id, spaceId, itemName, emailAddress } = item;
  const openEmailDetailView = () => {
    logSelectVaultItem(id, ItemType.Email);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.Email, id);
  };
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="email" />}
      itemSpaceId={spaceId}
      title={itemName}
      subtitle={emailAddress}
      onClick={openEmailDetailView}
    />
  );
};
export const EmailListItem = memo(EmailComponent);
