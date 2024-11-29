import { Lee } from "../../../../../lee";
import { Credential, VaultItemType } from "@dashlane/vault-contracts";
import { CredentialSearchItem } from "../../items";
import { useItemSearchData } from "../use-item-search-data";
import { logSelectCredential } from "../../../../../libs/logs/events/vault/select-item";
import SearchEventLogger from "../../search-event-logger";
import { SearchResultsSection } from "./search-results-section";
interface CredentialsProps {
  lee: Lee;
  query: string;
}
const I18N_KEYS = {
  PASSWORDS_HEADER: "webapp_sidemenu_search_results_heading_passwords",
};
export const Credentials = ({ lee, query }: CredentialsProps) => {
  const { loadMore, result } = useItemSearchData<Credential>(
    query,
    VaultItemType.Credential
  );
  if (!result?.matchCount) {
    return null;
  }
  const { items, matchCount } = result;
  SearchEventLogger.updateSearchSubTypes("credentials", matchCount);
  return (
    <SearchResultsSection
      i18nKey={I18N_KEYS.PASSWORDS_HEADER}
      loadMore={loadMore}
      matchCount={matchCount}
      loadedCount={items.length}
    >
      {items.map((credential: Credential, index: number) => (
        <CredentialSearchItem
          lee={lee}
          credential={credential}
          key={credential.id}
          onSelectCredential={() => {
            SearchEventLogger.logSearchEvent();
            logSelectCredential(credential.id, index + 1, matchCount);
          }}
        />
      ))}
    </SearchResultsSection>
  );
};
