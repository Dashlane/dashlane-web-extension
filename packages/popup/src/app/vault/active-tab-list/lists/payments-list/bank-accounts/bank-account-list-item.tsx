import React from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { BankAccount, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
import { BankAccountActions } from "./bank-account-actions";
export interface BankAccountComponentProps {
  item: BankAccount;
}
const BankAccountComponent = ({ item }: BankAccountComponentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { id, accountName, ownerName, spaceId } = item;
  const openBankAccountDetailView = () => {
    logSelectVaultItem(id, ItemType.BankStatement);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.BankAccount, id);
  };
  const closeDropdown = () => setIsDropdownOpen(false);
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="bank-account" />}
      itemSpaceId={spaceId}
      title={accountName}
      subtitle={ownerName}
      onClick={openBankAccountDetailView}
      onRowLeave={closeDropdown}
      actions={
        <BankAccountActions
          bankAccount={item}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      }
    />
  );
};
export const BankAccountListItem = React.memo(BankAccountComponent);
