import React from "react";
import { FiscalId, ItemsQueryResult } from "@dashlane/vault-contracts";
import { VaultItemsList } from "../../common";
import { FiscalIdListItem } from "./fiscal-id-list-item";
interface Props {
  fiscalIdsResult: ItemsQueryResult<FiscalId>;
}
export const FiscalIdsList = ({ fiscalIdsResult }: Props) => (
  <VaultItemsList
    ItemComponent={FiscalIdListItem}
    items={fiscalIdsResult.items}
    titleKey={"tab/all_items/ids/fiscal_id/title"}
    totalItemsCount={fiscalIdsResult.matchCount}
  />
);
