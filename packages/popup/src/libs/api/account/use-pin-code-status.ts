import { pinCodeApi } from "@dashlane/authentication-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export function usePinCodeStatus() {
  const { data, status } = useModuleQuery(pinCodeApi, "getCurrentUserStatus");
  return {
    isPinCodeEnabled: data?.isPinCodeEnabled,
    isPinCodeStatusLoading: status === DataStatus.Loading,
  };
}
