import { Command } from "Shared/Api";
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
} from "@dashlane/communication";
export type RecoveryCommands = {
  activateAccountRecovery: Command<void, ActivateAccountRecoveryResult>;
  setupMasterPasswordForRecovery: Command<
    SetupMasterPasswordForRecoveryParam,
    SetupMasterPasswordForRecoveryResult
  >;
  deactivateAccountRecovery: Command<void, DeactivateAccountRecoveryResult>;
  registerDeviceForRecovery: Command<
    RegisterDeviceForRecoveryParam,
    RegisterDeviceForRecoveryResult
  >;
  startAccountRecovery: Command<
    StartAccountRecoveryParam,
    StartAccountRecoveryResult
  >;
  sendRecoveryRequest: Command<void, SendRecoveryRequestResult>;
  checkRecoveryRequestStatus: Command<
    CheckRecoveryRequestStatusParams,
    CheckRecoveryRequestStatusResult
  >;
  cancelRecoveryRequest: Command<void, CancelRecoveryRequestResult>;
  recoverUserData: Command<RecoverUserDataParam, RecoverUserDataResult>;
  checkDoesLocalRecoveryKeyExist: Command<void, CheckLocalRecoveryKeyResult>;
  isRecoveryRequestPending: Command<void, IsRecoveryRequestPendingResult>;
};
