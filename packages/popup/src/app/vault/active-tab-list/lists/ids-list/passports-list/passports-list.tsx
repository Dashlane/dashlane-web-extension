import React from "react";
import { ItemsQueryResult, Passport } from "@dashlane/vault-contracts";
import { VaultItemsList } from "../../common";
import { PassportListItem } from "./passport-list-item";
interface Props {
  passportsResult: ItemsQueryResult<Passport>;
}
export const PassportsList = ({ passportsResult }: Props) => (
  <VaultItemsList
    ItemComponent={PassportListItem}
    items={passportsResult.items}
    titleKey={"tab/all_items/ids/passport/title"}
    totalItemsCount={passportsResult.matchCount}
  />
);
