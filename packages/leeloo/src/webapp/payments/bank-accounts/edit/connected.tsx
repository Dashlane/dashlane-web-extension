import { useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { BankAccountEditView } from "./view";
interface Props {
  match: {
    params: {
      uuid: string;
    };
  };
}
export const Connected = (props: Props) => {
  const { data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.BankAccount],
    ids: [`{${props.match.params.uuid}}`],
  });
  if (!data?.bankAccountsResult.items.length) {
    return null;
  }
  return (
    <BankAccountEditView {...props} item={data.bankAccountsResult.items[0]} />
  );
};
