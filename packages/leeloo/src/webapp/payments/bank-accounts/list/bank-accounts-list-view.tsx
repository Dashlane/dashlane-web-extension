import { memo } from "react";
import { BankAccount, ItemsQueryResult } from "@dashlane/vault-contracts";
import { BankAccountListHeader } from "./list-header/bank-account-list-header";
import { BankAccountListItem } from "./list-item/bank-account-list-item";
export interface BankAccountListViewProps {
  bankAccountsResult: ItemsQueryResult<BankAccount>;
}
const BankAccountsListViewComponent = ({
  bankAccountsResult,
}: BankAccountListViewProps) => {
  return (
    <>
      <BankAccountListHeader quantity={bankAccountsResult.matchCount} />
      <ul sx={{ minWidth: "800px", paddingBottom: "32px" }}>
        {bankAccountsResult.items.map((bankAccount) => (
          <BankAccountListItem key={bankAccount.id} bankAccount={bankAccount} />
        ))}
      </ul>
    </>
  );
};
export const BankAccountsListView = memo(BankAccountsListViewComponent);
