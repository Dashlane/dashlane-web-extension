import { breachesApi } from "@dashlane/password-security-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
export interface UseUnreadBreachesCount {
  count: number | null;
}
export const useUnreadBreachesCount = (): UseUnreadBreachesCount => {
  const { data } = useModuleQuery(breachesApi, "unreadBreachesCount");
  return {
    count: data?.count ?? null,
  };
};
