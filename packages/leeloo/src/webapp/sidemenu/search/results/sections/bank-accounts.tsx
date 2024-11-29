import { BankAccount, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectBankAccount } from "../../../../../libs/logs/events/vault/select-item";
import { useRouterGlobalSettingsContext } from "../../../../../libs/router/RouterGlobalSettingsProvider";
import { BankAccountSearchItem } from "../../items";
import { useItemSearchData } from "../use-item-search-data";
import SearchEventLogger from "../../search-event-logger";
import { SearchResultsSection } from "./search-results-section";
const I18N_KEYS = {
  BANK_ACCOUNTS_HEADER: "webapp_sidemenu_search_results_heading_bank_accounts",
};
export interface BankAccountsProps {
  query: string;
}
export const BankAccounts = ({ query }: BankAccountsProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { loadMore, result } = useItemSearchData<BankAccount>(
    query,
    VaultItemType.BankAccount
  );
  if (!result?.matchCount) {
    return null;
  }
  const { items, matchCount } = result;
  SearchEventLogger.updateSearchSubTypes("bankAccounts", matchCount);
  return (
    <SearchResultsSection
      i18nKey={I18N_KEYS.BANK_ACCOUNTS_HEADER}
      loadMore={loadMore}
      matchCount={matchCount}
      loadedCount={items.length}
    >
      {items.map((bankAccount: BankAccount, index: number) => (
        <BankAccountSearchItem
          key={bankAccount.id}
          bankAccount={bankAccount}
          getRoute={routes.userBankAccount}
          onSelectBankAccount={() => {
            SearchEventLogger.logSearchEvent();
            logSelectBankAccount(bankAccount.id, index + 1, matchCount);
          }}
        />
      ))}
    </SearchResultsSection>
  );
};
