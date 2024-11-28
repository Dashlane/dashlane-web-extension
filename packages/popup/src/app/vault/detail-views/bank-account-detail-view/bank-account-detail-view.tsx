import React, { memo, useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import { useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { DataStatus } from "../../../../libs/api/types";
import { logPageView } from "../../../../libs/logs/logEvent";
import { BankAccountDetailHeader } from "./bank-account-detail-header";
import { BankAccountDetailForm } from "./bank-account-detail-form";
interface BankAccountDetailViewComponentProps {
  onClose: () => void;
  itemId: string;
}
const BankAccountDetailViewComponent = ({
  onClose,
  itemId,
}: BankAccountDetailViewComponentProps) => {
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.BankAccount],
    ids: [itemId],
  });
  useEffect(() => {
    logPageView(PageView.ItemBankStatementDetails);
  }, []);
  if (status !== DataStatus.Success || !data.bankAccountsResult.items.length) {
    return null;
  }
  const bankAccount = data.bankAccountsResult.items[0];
  return (
    <>
      <BankAccountDetailHeader
        name={bankAccount.accountName}
        id={bankAccount.id}
        onClose={onClose}
      />
      <BankAccountDetailForm bankAccount={bankAccount} />
    </>
  );
};
export const BankAccountDetailView = memo(BankAccountDetailViewComponent);
