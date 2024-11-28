import React from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useModuleQuery } from "@dashlane/framework-react";
import { VaultItemType, vaultSearchApi } from "@dashlane/vault-contracts";
import SearchEventLogger from "../../../search-event-logger";
import { useSearchContext } from "../../../search-field/search-context";
import { VaultTabType } from "../../../types";
import { PaymentCardsList } from "./payment-cards/payment-cards-list";
import { BankAccountsList } from "./bank-accounts/bank-accounts-list";
import { BaseListContainer } from "../common";
import styles from "../common/sharedListStyles.css";
export const PaymentsListContainer = () => {
  const { searchValue } = useSearchContext();
  const { status, data } = useModuleQuery(vaultSearchApi, "search", {
    searchQuery: searchValue,
    vaultItemTypes: [VaultItemType.BankAccount, VaultItemType.PaymentCard],
  });
  if (status !== DataStatus.Success) {
    return null;
  }
  const { bankAccountsResult, paymentCardsResult } = data;
  const totalItemsCount =
    bankAccountsResult.matchCount + paymentCardsResult.matchCount;
  SearchEventLogger.totalCount = totalItemsCount;
  return (
    <BaseListContainer
      hasItems={totalItemsCount > 0}
      vaultTabType={VaultTabType.Payments}
    >
      <div
        className={styles.listContent}
        aria-labelledby="tab-payments"
        id="content-payments"
      >
        <PaymentCardsList paymentCardsResult={paymentCardsResult} />
        <BankAccountsList bankAccountsResult={bankAccountsResult} />
      </div>
    </BaseListContainer>
  );
};
