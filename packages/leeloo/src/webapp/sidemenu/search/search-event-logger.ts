import { debounce } from "lodash";
import { UserSearchVaultItemEvent } from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
const SearchEventLogger = {
  charactersTypedCount: 0,
  totalCount: 0,
  searchSubTypes: {
    credentials: 0,
    notes: 0,
    identities: 0,
    emails: 0,
    phones: 0,
    addresses: 0,
    companies: 0,
    personalWebsites: 0,
    paymentCards: 0,
    bankAccounts: 0,
    documents: 0,
  },
  updateSearchSubTypes: (key: string, value: number) =>
    (SearchEventLogger.searchSubTypes[key] = value),
  logSearchEvent: debounce(function (hasInteracted = true) {
    logEvent(
      new UserSearchVaultItemEvent({
        charactersTypedCount: SearchEventLogger.charactersTypedCount,
        hasInteracted: hasInteracted,
        totalCount:
          SearchEventLogger.totalCount > 0
            ? SearchEventLogger.totalCount
            : Object.values(SearchEventLogger.searchSubTypes).reduce(
                (a, b) => a + b
              ),
      })
    );
  }, 300),
};
export default SearchEventLogger;
