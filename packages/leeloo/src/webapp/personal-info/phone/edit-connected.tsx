import React from "react";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  Phone,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { Props as BaseProps } from "../generic-edit";
import { PhoneEditPanel } from "./edit";
type Props = BaseProps<Phone>;
export const Connected = (props: Props) => {
  const { data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Phone],
    ids: [`{${props.match.params.uuid}}`],
  });
  return <PhoneEditPanel {...props} item={data?.phonesResult.items[0]} />;
};
