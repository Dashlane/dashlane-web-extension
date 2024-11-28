import React, { memo, useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { logPageView } from "../../../../../libs/logs/logEvent";
import { FiscalIdDetailHeader } from "./fiscal-id-header";
import { FiscalIdDetailForm } from "./fiscal-id-form";
interface Props {
  onClose: () => void;
  itemId: string;
}
const FiscalIdDetailViewComponent = ({ onClose, itemId }: Props) => {
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.FiscalId],
    ids: [itemId],
  });
  useEffect(() => {
    logPageView(PageView.ItemFiscalStatementDetails);
  }, []);
  if (status !== DataStatus.Success || !data.fiscalIdsResult.items.length) {
    return null;
  }
  const fiscalId = data.fiscalIdsResult.items[0];
  return (
    <>
      <FiscalIdDetailHeader
        name={fiscalId.fiscalNumber}
        id={fiscalId.id}
        onClose={onClose}
      />
      <FiscalIdDetailForm fiscalId={fiscalId} />
    </>
  );
};
export const FiscalIdDetailView = memo(FiscalIdDetailViewComponent);
