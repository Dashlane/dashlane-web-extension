import React from "react";
import { PaymentCard, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectCreditCard } from "../../../../../libs/logs/events/vault/select-item";
import { useRouterGlobalSettingsContext } from "../../../../../libs/router/RouterGlobalSettingsProvider";
import { PaymentCardSearchItem } from "../../items";
import { useItemSearchData } from "../use-item-search-data";
import SearchEventLogger from "../../search-event-logger";
import { SearchResultsSection } from "./search-results-section";
const I18N_KEYS = {
  PAYMENT_CARDS_HEADER: "webapp_sidemenu_search_results_heading_payment_cards",
};
export interface PaymentCardsProps {
  query: string;
}
export const PaymentCards = ({ query }: PaymentCardsProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { loadMore, result } = useItemSearchData<PaymentCard>(
    query,
    VaultItemType.PaymentCard
  );
  if (!result?.matchCount) {
    return null;
  }
  const { items, matchCount } = result;
  SearchEventLogger.updateSearchSubTypes("paymentCards", matchCount);
  return (
    <SearchResultsSection
      i18nKey={I18N_KEYS.PAYMENT_CARDS_HEADER}
      loadMore={loadMore}
      matchCount={matchCount}
      loadedCount={items.length}
    >
      {items.map((paymentCard: PaymentCard, index: number) => (
        <PaymentCardSearchItem
          key={paymentCard.id}
          paymentCard={paymentCard}
          getRoute={routes.userPaymentCard}
          onSelectPaymentCard={() => {
            SearchEventLogger.logSearchEvent();
            logSelectCreditCard(paymentCard.id, index + 1, matchCount);
          }}
        />
      ))}
    </SearchResultsSection>
  );
};
