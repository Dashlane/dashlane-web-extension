import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { CheckAccountRecoveryStatusResult } from "../main-flow/types";
import { XstateFunctionalError } from "@dashlane/xstate-utils";
export interface CarbonLegacyErrorEvent {
  type: "CARBON_LEGACY_ERROR";
  error: string;
}
export interface InputMasterPasswordEvent {
  type: "INPUT_MASTER_PASSWORD";
  masterPassword: string;
  rememberMe: boolean;
}
export interface DeviceLimitAbortedEvent {
  type: "DEVICE_LIMIT_ABORTED";
}
export interface InitializationAccountRecoveryStatusEvent {
  type: "INIT_ACCOUNT_RECOVERY_STATUS";
  data: CheckAccountRecoveryStatusResult;
}
export interface SSOMigrationResult {
  serviceProviderRedirectUrl: string;
  isNitroProvider: boolean;
  migration: AuthenticationFlowContracts.SSOMigrationType;
}
export interface LoginStatusUpdateEvent {
  type: "LOGIN_STATUS_UPDATE";
  data: SSOMigrationResult | undefined;
}
export interface SwitchToPinCodeEvent {
  type: "SWITCH_TO_PIN_CODE";
}
export type MasterPasswordFlowEvents =
  | DeviceLimitAbortedEvent
  | InputMasterPasswordEvent
  | InitializationAccountRecoveryStatusEvent
  | CarbonLegacyErrorEvent
  | LoginStatusUpdateEvent
  | SwitchToPinCodeEvent;
export class MpVerificationError extends XstateFunctionalError {}
