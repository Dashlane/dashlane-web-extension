import { useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
export const useIdentitiesCount = () => {
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Identity],
  });
  return { status, count: data?.identitiesResult.matchCount ?? 0 };
};
