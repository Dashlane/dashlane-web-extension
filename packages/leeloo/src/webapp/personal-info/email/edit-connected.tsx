import React from "react";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  Email,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { Props as BaseProps } from "../generic-edit";
import { EmailEditPanel } from "./edit";
type Props = BaseProps<Email>;
export const Connected = (props: Props) => {
  const { data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Email],
    ids: [`{${props.match.params.uuid}}`],
  });
  return <EmailEditPanel {...props} item={data?.emailsResult.items[0]} />;
};
