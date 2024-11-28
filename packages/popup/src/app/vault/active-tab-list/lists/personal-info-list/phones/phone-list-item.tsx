import { memo } from "react";
import { jsx, VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { Phone, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export interface Props {
  item: Phone;
}
const PhoneComponent = ({ item }: Props) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { id, spaceId, phoneNumber, numberInternational, numberNational } =
    item;
  const openPhoneDetailView = () => {
    logSelectVaultItem(id, ItemType.Phone);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.Phone, id);
  };
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="phone-number" />}
      itemSpaceId={spaceId}
      title={phoneNumber}
      subtitle={numberInternational || numberNational}
      onClick={openPhoneDetailView}
    />
  );
};
export const PhoneListItem = memo(PhoneComponent);
