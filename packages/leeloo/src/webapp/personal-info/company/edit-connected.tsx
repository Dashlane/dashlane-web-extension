import React from "react";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  Company,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { Props as BaseProps } from "../generic-edit";
import { CompanyEditPanel } from "./edit";
type Props = BaseProps<Company>;
export const Connected = (props: Props) => {
  const { data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Company],
    ids: [`{${props.match.params.uuid}}`],
  });
  return <CompanyEditPanel {...props} item={data?.companiesResult.items[0]} />;
};
