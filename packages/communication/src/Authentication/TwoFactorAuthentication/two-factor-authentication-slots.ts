import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import {
  RefreshTwoFactorAuthenticationInfoResult,
  RefreshU2FDevicesResult,
  RemoveU2FAuthenticatorRequest,
  RemoveU2FAuthenticatorResult,
  TwoFactorAuthenticationEnableFlowStageData,
  TwoFactorAuthenticationEnableFlowStageRequest,
  TwoFactorAuthenticationEnableFlowStageResult,
  TwoFactorAuthenticationFlowStageData,
  TwoFactorAuthenticationFlowStageRequest,
  TwoFactorAuthenticationFlowStageResult,
  U2FDevice,
} from "./types";
export const twoFactorAuthenticationCommandsSlots = {
  refreshU2FDevicesList: slot<void, RefreshU2FDevicesResult>(),
  removeU2FAuthenticator: slot<
    RemoveU2FAuthenticatorRequest,
    RemoveU2FAuthenticatorResult
  >(),
  refreshTwoFactorAuthenticationInfo: slot<
    void,
    RefreshTwoFactorAuthenticationInfoResult
  >(),
  startTwoFactorAuthenticationEnableFlow: slot<
    TwoFactorAuthenticationEnableFlowStageRequest,
    TwoFactorAuthenticationEnableFlowStageResult
  >(),
  stopTwoFactorAuthenticationEnableFlow: slot<
    TwoFactorAuthenticationEnableFlowStageRequest,
    TwoFactorAuthenticationEnableFlowStageResult
  >(),
  continueTwoFactorAuthenticationEnableFlow: slot<
    TwoFactorAuthenticationEnableFlowStageRequest,
    TwoFactorAuthenticationEnableFlowStageResult
  >(),
  backTwoFactorAuthenticationEnableFlow: slot<
    TwoFactorAuthenticationEnableFlowStageRequest,
    TwoFactorAuthenticationEnableFlowStageResult
  >(),
  startTwoFactorAuthenticationDisableFlow: slot<
    TwoFactorAuthenticationFlowStageRequest,
    TwoFactorAuthenticationFlowStageResult
  >(),
  stopTwoFactorAuthenticationDisableFlow: slot<
    TwoFactorAuthenticationFlowStageRequest,
    TwoFactorAuthenticationFlowStageResult
  >(),
  continueTwoFactorAuthenticationDisableFlow: slot<
    TwoFactorAuthenticationFlowStageRequest,
    TwoFactorAuthenticationFlowStageResult
  >(),
  backTwoFactorAuthenticationDisableFlow: slot<
    TwoFactorAuthenticationFlowStageRequest,
    TwoFactorAuthenticationFlowStageResult
  >(),
};
export const twoFactorAuthenticationQueriesSlots = {
  getU2FDevicesList: slot<void, U2FDevice[]>(),
  getTwoFactorAuthenticationEnableStage: slot<
    void,
    TwoFactorAuthenticationEnableFlowStageData
  >(),
  getTwoFactorAuthenticationDisableStage: slot<
    void,
    TwoFactorAuthenticationFlowStageData
  >(),
};
export const twoFactorAuthenticationLiveQueriesSlots = {
  liveU2FDevicesList: liveSlot<U2FDevice[]>(),
  liveTwoFactorAuthenticationEnableStage:
    liveSlot<TwoFactorAuthenticationEnableFlowStageData>(),
  liveTwoFactorAuthenticationDisableStage:
    liveSlot<TwoFactorAuthenticationFlowStageData>(),
};
