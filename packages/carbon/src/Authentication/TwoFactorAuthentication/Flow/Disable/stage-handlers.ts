import {
  AuthenticationCodeSubmitRequest,
  AuthenticationCode as AuthenticationErrorCode,
  ChangeAuthenticationModeRequest,
  TwoFactorAuthenticationDisableStages,
  TwoFactorAuthenticationFlowStageRequest,
  TwoFactorAuthenticationInfoRequestStatus,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  stopTwoFactorAuthenticationStage,
  TwoFactorAuthenticationDisableFlowStoreState,
  updateTwoFactorAuthenticationStage,
} from "./Store";
import {
  disableTwoFactorAuthenticationTOTP1Handler,
  disableTwoFactorAuthenticationTOTP2Handler,
  refreshTwoFactorAuthenticationInfoHandler,
} from "Authentication/TwoFactorAuthentication/handlers";
import { twoFactorAuthenticationInfoSelector } from "Authentication/TwoFactorAuthentication/selectors";
import { performTotpVerificationService } from "Authentication/TwoFactorAuthentication/services";
import { TwoFactorAuthenticationHandlerResult } from "Authentication/TwoFactorAuthentication/handlers/types";
import { getTwoFactorAuthenticationDisableFlowData } from "./Store/selectors";
import { userLoginSelector } from "Session/selectors";
import { wipeOutLocalAccounts } from "UserManagement";
type DisableFlowType =
  | TwoFactorAuthenticationType.DEVICE_REGISTRATION
  | TwoFactorAuthenticationType.LOGIN;
interface DisableFlowTypeData {
  handler: (
    services: CoreServices,
    authTicket: string
  ) => Promise<TwoFactorAuthenticationHandlerResult>;
  showLoading: boolean;
}
const DISABLE_TWO_FACTOR_AUTHENTICATION_HANDLER_MAPPING: Record<
  DisableFlowType,
  DisableFlowTypeData
> = {
  [TwoFactorAuthenticationType.DEVICE_REGISTRATION]: {
    handler: disableTwoFactorAuthenticationTOTP1Handler,
    showLoading: false,
  },
  [TwoFactorAuthenticationType.LOGIN]: {
    handler: disableTwoFactorAuthenticationTOTP2Handler,
    showLoading: true,
  },
};
const disableTwoFactorAuthenticationHandler = async (
  coreServices: CoreServices,
  data: TwoFactorAuthenticationDisableFlowStoreState,
  flowStageRequest: AuthenticationCodeSubmitRequest
) => {
  const { storeService } = coreServices;
  const updateStore = (
    updateData: TwoFactorAuthenticationDisableFlowStoreState
  ) => {
    const action = updateTwoFactorAuthenticationStage({
      ...updateData,
    });
    storeService.dispatch(action);
  };
  try {
    const flowData = getTwoFactorAuthenticationDisableFlowData(
      storeService.getState()
    );
    const twoFactorAuthenticationStoreState =
      twoFactorAuthenticationInfoSelector(storeService.getState());
    if (
      twoFactorAuthenticationStoreState.status ===
      TwoFactorAuthenticationInfoRequestStatus.READY
    ) {
      const { type: otpType } = twoFactorAuthenticationStoreState;
      const { authenticationCode } = flowStageRequest;
      const responseTotpVerification = await performTotpVerificationService(
        coreServices,
        authenticationCode
      );
      if (responseTotpVerification.success) {
        const { authTicket } = responseTotpVerification;
        if (DISABLE_TWO_FACTOR_AUTHENTICATION_HANDLER_MAPPING[otpType]) {
          const {
            handler: disableTwoFactorAuthenticationTOTP,
            showLoading,
          }: DisableFlowTypeData =
            DISABLE_TWO_FACTOR_AUTHENTICATION_HANDLER_MAPPING[otpType];
          if (showLoading) {
            updateStore({
              ...data,
              stage: TwoFactorAuthenticationDisableStages.FINALIZING_CHANGES,
            });
          }
          const response = await disableTwoFactorAuthenticationTOTP(
            coreServices,
            authTicket
          );
          if (response.success) {
            if (response.logoutRequired) {
              const newFlowData = {
                ...flowData,
                logoutRequired: response.logoutRequired,
              };
              updateStore({
                ...data,
                stage: TwoFactorAuthenticationDisableStages.LOGOUT_REQUIRED,
                flowData: newFlowData,
              });
            } else {
              await refreshTwoFactorAuthenticationInfoHandler(coreServices);
              updateStore({
                ...data,
                stage: TwoFactorAuthenticationDisableStages.SUCCESS,
              });
              storeService.dispatch(stopTwoFactorAuthenticationStage());
            }
          } else {
            updateStore({
              ...data,
              stage: TwoFactorAuthenticationDisableStages.GENERIC_ERROR,
              stageData: { ...response },
            });
          }
        } else {
          updateStore({
            ...data,
            stage: TwoFactorAuthenticationDisableStages.GENERIC_ERROR,
            stageData: {
              success: false,
              error: {
                code: AuthenticationErrorCode.UNEXPECTED_OTP_TYPE,
              },
            },
          });
        }
      } else {
        updateStore({
          ...data,
          stageData: responseTotpVerification,
        });
      }
    } else {
      updateStore({
        ...data,
        stage: TwoFactorAuthenticationDisableStages.GENERIC_ERROR,
        stageData: {
          success: false,
          error: {
            code: AuthenticationErrorCode.UNKNOWN_ERROR,
          },
        },
      });
    }
  } catch (e) {
    updateStore({
      ...data,
      stageData: {
        success: false,
        error: {
          code: AuthenticationErrorCode.UNKNOWN_ERROR,
        },
      },
    });
  }
  return { success: true };
};
export const disableTwoFactorAuthenticationCodeHandler = async (
  coreServices: CoreServices,
  data: TwoFactorAuthenticationDisableFlowStoreState,
  flowStageRequest: TwoFactorAuthenticationFlowStageRequest
) => {
  const target = (flowStageRequest as ChangeAuthenticationModeRequest).target;
  if (target) {
    const { storeService } = coreServices;
    const action = updateTwoFactorAuthenticationStage({
      ...data,
      stage: target,
      stageData: undefined,
    });
    storeService.dispatch(action);
    return { success: true };
  }
  return await disableTwoFactorAuthenticationHandler(
    coreServices,
    data,
    flowStageRequest as AuthenticationCodeSubmitRequest
  );
};
export const disableTwoFactorAuthenticationLogoutRequiredHandler = async (
  coreServices: CoreServices
) => {
  const { storeService, storageService, sessionService, moduleClients } =
    coreServices;
  const login = userLoginSelector(storeService.getState());
  storeService.dispatch(stopTwoFactorAuthenticationStage());
  if (login) {
    await wipeOutLocalAccounts(storageService, moduleClients["carbon-legacy"], [
      login,
    ]);
  }
  await sessionService.close();
  return { success: true };
};
