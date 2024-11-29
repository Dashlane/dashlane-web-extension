import { useNodePremiumStatus } from "../../../libs/carbon/hooks/useNodePremiumStatus";
export const useHasSecretManagement = (): boolean => {
  const accountInfoResult = useNodePremiumStatus();
  if (accountInfoResult.status !== "success" || !accountInfoResult.data) {
    return false;
  }
  const isSecretManagementCapabilityEnabled =
    !!accountInfoResult.data.capabilities?.secretManagement.enabled;
  return isSecretManagementCapabilityEnabled;
};
