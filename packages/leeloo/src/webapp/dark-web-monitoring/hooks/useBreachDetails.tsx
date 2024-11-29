import {
  BreachDetailItemView,
  breachesApi,
  passwordHealthApi,
} from "@dashlane/password-security-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
export interface UseBreachDetails {
  breach: BreachDetailItemView | null;
  compromisedCredentialsIds: string[];
}
export const useBreachDetails = (breachId: string): UseBreachDetails => {
  const { data } = useModuleQuery(breachesApi, "breach", { id: breachId });
  const { data: compromisedCredentialsIds } = useModuleQuery(
    passwordHealthApi,
    "compromisedCredentialsIdsForBreach",
    { breachId }
  );
  return {
    breach: data ?? null,
    compromisedCredentialsIds: compromisedCredentialsIds ?? [],
  };
};
