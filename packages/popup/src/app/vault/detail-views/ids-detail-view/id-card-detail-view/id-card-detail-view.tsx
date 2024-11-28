import React, { memo, useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { logPageView } from "../../../../../libs/logs/logEvent";
import { IdCardDetailHeader } from "./id-card-detail-header";
import { IdCardDetailForm } from "./id-card-detail-form";
interface PaymentCardDetailViewComponentProps {
  onClose: () => void;
  itemId: string;
}
const IdCardDetailViewComponent = ({
  onClose,
  itemId,
}: PaymentCardDetailViewComponentProps) => {
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.IdCard],
    ids: [itemId],
  });
  useEffect(() => {
    logPageView(PageView.ItemCreditCardDetails);
  }, []);
  if (status !== DataStatus.Success || !data.idCardsResult.items.length) {
    return null;
  }
  const idCard = data.idCardsResult.items[0];
  return (
    <>
      <IdCardDetailHeader
        name={idCard.idName}
        id={idCard.id}
        onClose={onClose}
      />
      <IdCardDetailForm idCard={idCard} />
    </>
  );
};
export const IdCardDetailView = memo(IdCardDetailViewComponent);
