import React from "react";
import { Address, ItemsQueryResult } from "@dashlane/vault-contracts";
import { VaultItemsList } from "../../common";
import { AddressListItem } from "./address-list-item";
interface AddressListProps {
  addressesResult: ItemsQueryResult<Address>;
}
export const AddressList = ({ addressesResult }: AddressListProps) => (
  <VaultItemsList
    ItemComponent={AddressListItem}
    items={addressesResult.items}
    titleKey={"tab/all_items/personal_info/addresses/title"}
    totalItemsCount={addressesResult.matchCount}
  />
);
