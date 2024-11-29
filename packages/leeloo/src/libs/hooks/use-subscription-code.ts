import { subscriptionCodeApi } from "@dashlane/account-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export function useSubscriptionCode(): string | null {
  const subscriptionCode = useModuleQuery(
    subscriptionCodeApi,
    "getSubscriptionCode"
  );
  return subscriptionCode.status === DataStatus.Success
    ? subscriptionCode.data
    : null;
}
