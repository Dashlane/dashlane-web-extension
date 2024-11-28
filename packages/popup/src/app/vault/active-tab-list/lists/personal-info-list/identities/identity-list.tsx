import React from "react";
import { Identity, ItemsQueryResult } from "@dashlane/vault-contracts";
import { VaultItemsList } from "../../common";
import { IdentityListItem } from "./identity-list-item";
interface IdentityListProps {
  identitiesResult: ItemsQueryResult<Identity>;
}
export const IdentityList = ({ identitiesResult }: IdentityListProps) => (
  <VaultItemsList
    ItemComponent={IdentityListItem}
    items={identitiesResult.items}
    titleKey={"tab/all_items/personal_info/identities/title"}
    totalItemsCount={identitiesResult.matchCount}
  />
);
