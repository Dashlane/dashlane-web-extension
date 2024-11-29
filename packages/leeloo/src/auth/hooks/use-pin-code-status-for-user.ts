import { pinCodeApi } from "@dashlane/authentication-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
type PinCodeStatusForUser =
  | {
      isPinCodeEnabled: true;
      isPinCodeStatusLoading: false;
      attemptsLeft: number;
    }
  | {
      isPinCodeEnabled: false;
      isPinCodeStatusLoading: boolean;
    };
export function usePinCodeStatusForUser(
  loginEmail: string
): PinCodeStatusForUser {
  const { data, status } = useModuleQuery(pinCodeApi, "getStatus", {
    loginEmail,
  });
  if (data?.isPinCodeEnabled) {
    return {
      isPinCodeEnabled: true,
      isPinCodeStatusLoading: false,
      attemptsLeft: data?.attemptsLeft,
    };
  }
  return {
    isPinCodeEnabled: false,
    isPinCodeStatusLoading: status === DataStatus.Loading,
  };
}
