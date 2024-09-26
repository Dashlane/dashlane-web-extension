import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  ActivateAccountRecoveryResult,
  CancelRecoveryRequestResult,
  CheckLocalRecoveryKeyResult,
  CheckRecoveryRequestStatusParams,
  CheckRecoveryRequestStatusResult,
  DeactivateAccountRecoveryResult,
  IsRecoveryRequestPendingResult,
  RecoverUserDataParam,
  RecoverUserDataResult,
  RegisterDeviceForRecoveryParam,
  RegisterDeviceForRecoveryResult,
  SendRecoveryRequestResult,
  SetupMasterPasswordForRecoveryParam,
  SetupMasterPasswordForRecoveryResult,
  StartAccountRecoveryParam,
  StartAccountRecoveryResult,
} from "./types";
export const recoveryCommandsSlots = {
  activateAccountRecovery: slot<void, ActivateAccountRecoveryResult>(),
  setupMasterPasswordForRecovery: slot<
    SetupMasterPasswordForRecoveryParam,
    SetupMasterPasswordForRecoveryResult
  >(),
  deactivateAccountRecovery: slot<void, DeactivateAccountRecoveryResult>(),
  registerDeviceForRecovery: slot<
    RegisterDeviceForRecoveryParam,
    RegisterDeviceForRecoveryResult
  >(),
  startAccountRecovery: slot<
    StartAccountRecoveryParam,
    StartAccountRecoveryResult
  >(),
  sendRecoveryRequest: slot<void, SendRecoveryRequestResult>(),
  cancelRecoveryRequest: slot<void, CancelRecoveryRequestResult>(),
  checkRecoveryRequestStatus: slot<
    CheckRecoveryRequestStatusParams,
    CheckRecoveryRequestStatusResult
  >(),
  recoverUserData: slot<RecoverUserDataParam, RecoverUserDataResult>(),
  checkDoesLocalRecoveryKeyExist: slot<void, CheckLocalRecoveryKeyResult>(),
  isRecoveryRequestPending: slot<void, IsRecoveryRequestPendingResult>(),
};
export const recoveryQueriesSlots = {
  getRecoveryOptInSetting: slot<void, boolean>(),
  getAccountRecoveryRequestCount: slot<void, number>(),
};
export const recoveryLiveQueriesSlots = {
  liveAccountRecoveryRequestCount: liveSlot<number>(),
};
