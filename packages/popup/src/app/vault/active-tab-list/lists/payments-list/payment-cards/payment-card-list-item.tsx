import React from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { PaymentCard, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
import { PaymentCardActions } from "./payment-card-actions";
export interface PaymentCardComponentProps {
  item: PaymentCard;
}
const PaymentCardComponent = ({ item }: PaymentCardComponentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { cardNumber, color, id, itemName, spaceId } = item;
  const openPaymentCardDetailView = () => {
    logSelectVaultItem(id, ItemType.CreditCard);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.PaymentCard, id);
  };
  const closeDropdown = () => setIsDropdownOpen(false);
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="payment-card" />}
      itemSpaceId={spaceId}
      title={itemName}
      subtitle={`•••• •••• •••• ${cardNumber.slice(-4)}`}
      onClick={openPaymentCardDetailView}
      onRowLeave={closeDropdown}
      actions={
        <PaymentCardActions
          paymentCard={item}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      }
    />
  );
};
export const PaymentCardListItem = React.memo(PaymentCardComponent);
