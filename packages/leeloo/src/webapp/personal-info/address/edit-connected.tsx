import React from "react";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  Address,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { Props as BaseProps } from "../generic-edit";
import { AddressEditPanel } from "./edit";
type Props = BaseProps<Address>;
export const Connected = (props: Props) => {
  const addressesQueryResult = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Address],
    ids: [`{${props.match.params.uuid}}`],
  });
  return (
    <AddressEditPanel
      {...props}
      item={addressesQueryResult.data?.addressesResult.items[0]}
    />
  );
};
