import { useState } from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { BankAccount as Item } from "@dashlane/vault-contracts";
import { logSelectBankAccount } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { BankAccountActions } from "../../../payments/bank-accounts/bank-account-actions/bank-account-actions";
import { BankAccountActionsMode } from "../../../payments/bank-accounts/bank-account-actions/types";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const BankAccountItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const bankAccount = item as Item;
  const [copyDropdownIsOpen, setCopyDropdownIsOpen] = useState(false);
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectBankAccount(bankAccount.id, index + 1, matchCount);
    closeSearch();
    redirect(routes.userBankAccount(bankAccount.id));
  };
  const actions = (
    <div sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
      <BankAccountActions
        bankAccount={bankAccount}
        dropdownIsOpen={copyDropdownIsOpen}
        setDropdownIsOpen={setCopyDropdownIsOpen}
        mode={BankAccountActionsMode.SEARCH}
      />
    </div>
  );
  return (
    <BaseResultItem
      id={bankAccount.id}
      title={bankAccount.accountName}
      description={bankAccount.ownerName}
      onClick={onClick}
      thumbnail={<VaultItemThumbnail type="bank-account" />}
      actions={actions}
    />
  );
};
