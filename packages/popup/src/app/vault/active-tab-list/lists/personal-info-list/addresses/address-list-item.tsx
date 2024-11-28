import { memo } from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { jsx } from "@dashlane/ui-components";
import { Address, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export interface AddressProps {
  item: Address;
}
const AddressComponent = ({ item }: AddressProps) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { id, spaceId, itemName, streetName, zipCode, city } = item;
  const openAddressDetailView = () => {
    logSelectVaultItem(id, ItemType.Address);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.Address, id);
  };
  const getViewedAddressSecondLine = () => {
    return [streetName ? streetName.split("\n")[0] : "", zipCode, city]
      .filter((addressPart) => !!addressPart)
      .join(", ");
  };
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="address" />}
      itemSpaceId={spaceId}
      title={itemName}
      subtitle={getViewedAddressSecondLine()}
      onClick={openAddressDetailView}
    />
  );
};
export const AddressListItem = memo(AddressComponent);
