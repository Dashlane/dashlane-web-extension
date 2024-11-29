import React from "react";
import { Country, FiscalId, VaultItemType } from "@dashlane/vault-contracts";
import { IdItemArticle } from "./id-item-article";
interface FiscalIdProps {
  item: FiscalId;
  route: string;
}
export const FiscalIdArticle = ({ item, route }: FiscalIdProps) => {
  const teledeclarantNumber =
    item.country === Country.FR ? item.teledeclarantNumber : undefined;
  return (
    <IdItemArticle
      itemId={item.id}
      title={item.fiscalNumber}
      description={teledeclarantNumber}
      country={item.country}
      type={VaultItemType.FiscalId}
      editRoute={route}
      copiableValue={item.fiscalNumber}
    />
  );
};
