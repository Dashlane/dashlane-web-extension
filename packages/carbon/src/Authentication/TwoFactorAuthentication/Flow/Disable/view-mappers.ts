import {
  AuthenticationCode as AuthenticationErrorCode,
  TwoFactorAuthenticationDisableFlowViewMappers,
} from "@dashlane/communication";
import { State } from "Store";
import { TwoFactorAuthenticationDisableAuthenticationCode } from "./Store/types";
export const disableTwoFactorAuthenticationCodeViewMapper = (
  state: State
): TwoFactorAuthenticationDisableFlowViewMappers => {
  const { stageData } = state.userSession.twoFactorAuthenticationDisableFlow;
  if (stageData) {
    if (!stageData.success) {
      const { error } =
        stageData as TwoFactorAuthenticationDisableAuthenticationCode;
      return { success: false, error };
    }
  }
  return undefined;
};
export const disableTwoFactorAuthenticationBackupCodeViewMapper = (
  state: State
): TwoFactorAuthenticationDisableFlowViewMappers => {
  const { stageData } = state.userSession.twoFactorAuthenticationDisableFlow;
  if (stageData && !stageData.success) {
    const { error } =
      stageData as TwoFactorAuthenticationDisableAuthenticationCode;
    if (error.code === AuthenticationErrorCode.OTP_NOT_VALID) {
      return {
        success: false,
        error: {
          code: AuthenticationErrorCode.BACKUP_CODE_NOT_VALID,
        },
      };
    }
    return { success: false, error };
  }
  return undefined;
};
