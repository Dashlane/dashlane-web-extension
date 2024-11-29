import { antiphishingApi } from "@dashlane/password-security-contracts";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
export const useAntiphishing = (domain: string | null) => {
  const { addAutoRedirectedDomain } = useModuleCommands(antiphishingApi);
  return {
    isAutoRedirected: useModuleQuery(
      antiphishingApi,
      "isAutoRedirectedDomain",
      {
        domain,
      }
    ),
    addToAutoRedirectedDomain: async () => {
      await addAutoRedirectedDomain({ domain });
    },
  };
};
