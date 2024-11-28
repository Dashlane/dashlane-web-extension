import React from "react";
import { DriversLicense, ItemsQueryResult } from "@dashlane/vault-contracts";
import { VaultItemsList } from "../../common";
import { DriverLicenseListItem } from "./driver-license-list-item";
interface Props {
  driversLicensesResult: ItemsQueryResult<DriversLicense>;
}
export const DriverLicensesList = ({ driversLicensesResult }: Props) => (
  <VaultItemsList
    ItemComponent={DriverLicenseListItem}
    items={driversLicensesResult.items}
    titleKey={"tab/all_items/ids/driver_license/title"}
    totalItemsCount={driversLicensesResult.matchCount}
  />
);
