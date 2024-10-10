import {
  AuthenticationCodeEnableStageRequest,
  AuthenticationCode as AuthenticationErrorCode,
  TwoFactorAuthenticationEnableStages,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { updateStore } from "Authentication/TwoFactorAuthentication/Flow/Enable/helpers";
import { TwoFactorAuthenticationEnableFlowStoreState } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store";
import { getTwoFactorAuthenticationEnableFlowData } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/selectors";
import { enableTwoFactorAuthenticationTOTP1Handler } from "Authentication/TwoFactorAuthentication/handlers/Enable/enable-two-factor-authentication-totp1-handler";
import { enableTwoFactorAuthenticationTOTP2Handler } from "Authentication/TwoFactorAuthentication/handlers/Enable/enable-two-factor-authentication-totp2-handler";
import { refreshTwoFactorAuthenticationInfoHandler } from "Authentication/TwoFactorAuthentication/handlers";
import { TwoFactorAuthenticationHandlerResult } from "Authentication/TwoFactorAuthentication/handlers/types";
import { TwoFactorAuthenticationDataToMigrate } from "Authentication/TwoFactorAuthentication/types";
import { performTotpVerificationService } from "Authentication/TwoFactorAuthentication/services";
type EnableFlowType =
  | TwoFactorAuthenticationType.DEVICE_REGISTRATION
  | TwoFactorAuthenticationType.LOGIN;
interface EnableFlowTypeData {
  handler: (
    services: CoreServices,
    authTicket: string,
    dataForMasterPasswordChange?: TwoFactorAuthenticationDataToMigrate
  ) => Promise<TwoFactorAuthenticationHandlerResult>;
  showLoading: boolean;
  errorStage?: TwoFactorAuthenticationEnableStages.GENERIC_ERROR;
}
const ENABLE_TWO_FACTOR_AUTHENTICATION_HANDLER_MAPPING: Record<
  EnableFlowType,
  EnableFlowTypeData
> = {
  [TwoFactorAuthenticationType.DEVICE_REGISTRATION]: {
    handler: enableTwoFactorAuthenticationTOTP1Handler,
    showLoading: false,
  },
  [TwoFactorAuthenticationType.LOGIN]: {
    handler: enableTwoFactorAuthenticationTOTP2Handler,
    showLoading: true,
    errorStage: TwoFactorAuthenticationEnableStages.GENERIC_ERROR,
  },
};
export const enableTwoFactorAuthenticationCodeHandler = async (
  coreServices: CoreServices,
  data: TwoFactorAuthenticationEnableFlowStoreState,
  { authenticationCode }: AuthenticationCodeEnableStageRequest
) => {
  const { storeService } = coreServices;
  try {
    const flowData = getTwoFactorAuthenticationEnableFlowData(
      storeService.getState()
    );
    const { authenticationType } = flowData;
    const performTotpVerificationResponse =
      await performTotpVerificationService(
        coreServices,
        authenticationCode,
        true
      );
    if (!performTotpVerificationResponse.success) {
      updateStore(coreServices, {
        ...data,
        stageData: performTotpVerificationResponse,
      });
      return { success: false };
    }
    if (ENABLE_TWO_FACTOR_AUTHENTICATION_HANDLER_MAPPING[authenticationType]) {
      const { authTicket } = performTotpVerificationResponse;
      const params = flowData[authenticationType];
      const {
        handler: enableTwoFactorAuthenticationTOTP,
        showLoading,
        errorStage,
      }: EnableFlowTypeData = ENABLE_TWO_FACTOR_AUTHENTICATION_HANDLER_MAPPING[
        authenticationType
      ];
      if (showLoading) {
        updateStore(coreServices, {
          ...data,
          stage: TwoFactorAuthenticationEnableStages.FINALIZING_CHANGES,
        });
      }
      const response = await enableTwoFactorAuthenticationTOTP(
        coreServices,
        authTicket,
        params
      );
      if (response.success) {
        if (!response.logoutRequired) {
          await refreshTwoFactorAuthenticationInfoHandler(coreServices);
        }
        const newFlowData = {
          ...flowData,
          logoutRequired: response.logoutRequired,
        };
        updateStore(coreServices, {
          ...data,
          stage: TwoFactorAuthenticationEnableStages.BACKUP_CODES,
          flowData: newFlowData,
        });
      } else {
        updateStore(coreServices, {
          ...data,
          stage: errorStage
            ? TwoFactorAuthenticationEnableStages.GENERIC_ERROR
            : TwoFactorAuthenticationEnableStages.AUTHENTICATION_CODE,
          stageData: { ...response },
        });
      }
    } else {
      updateStore(coreServices, {
        ...data,
        stage: TwoFactorAuthenticationEnableStages.GENERIC_ERROR,
        stageData: {
          success: false,
        },
      });
    }
    return { success: true };
  } catch (error) {
    updateStore(coreServices, {
      ...data,
      stageData: {
        success: false,
        error: {
          code: AuthenticationErrorCode.UNKNOWN_ERROR,
        },
      },
    });
    return { success: false };
  }
};
