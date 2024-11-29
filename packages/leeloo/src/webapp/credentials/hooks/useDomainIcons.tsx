import { useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi } from "@dashlane/vault-contracts";
export const useDomainIcons = (domain: string) => {
  const { data } = useModuleQuery(vaultItemsCrudApi, "domainIconDetails", {
    domain,
  });
  return {
    icon: data ?? undefined,
  };
};
