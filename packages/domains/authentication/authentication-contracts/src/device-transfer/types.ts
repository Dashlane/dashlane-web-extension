export enum TrustedDeviceFlowErrors {
  GENERIC_ERROR = "GENERIC_ERROR",
  INVALID_PASSPHRASE = "INVALID_PASSPHRASE",
  TIMEOUT = "TIMEOUT",
  PASSPHRASE_ATTEMPTS_LIMIT = "PASSPHRASE_ATTEMPTS_LIMIT",
}
export enum TrustedDeviceFlowStep {
  WaitingForNewDeviceRequest,
  NewDeviceRequestAvailable,
  DisplayPassphraseChallenge,
  DeviceTransferComplete,
  LoadingChallenge,
  DeviceTransferRejected,
  Error,
}
export interface TrustedDeviceFlowIdleView {
  readonly step: TrustedDeviceFlowStep.WaitingForNewDeviceRequest;
}
export interface TrustedDeviceFlowNewRequestView {
  readonly step: TrustedDeviceFlowStep.NewDeviceRequestAvailable;
  readonly untrustedDeviceName: string;
  readonly untrustedDeviceLocation: string;
  readonly requestTimestamp: number;
}
export interface TrustedDeviceFlowLoadingChallengeView {
  readonly step: TrustedDeviceFlowStep.LoadingChallenge;
}
export interface TrustedDeviceFlowDisplayChallengeView {
  readonly step: TrustedDeviceFlowStep.DisplayPassphraseChallenge;
  readonly passphrase: string[];
  readonly untrustedDeviceName: string;
  readonly error?: TrustedDeviceFlowErrors;
}
export interface TrustedDeviceFlowDeviceTransferCompleteView {
  readonly step: TrustedDeviceFlowStep.DeviceTransferComplete;
  readonly untrustedDeviceName: string;
}
export interface TrustedDeviceFlowDeviceTransferRejectedView {
  readonly step: TrustedDeviceFlowStep.DeviceTransferRejected;
  readonly untrustedDeviceName: string;
}
export interface TrustedDeviceFlowErrorView {
  readonly step: TrustedDeviceFlowStep.Error;
  readonly errorCode: TrustedDeviceFlowErrors;
}
export type TrustedDeviceFlowView =
  | TrustedDeviceFlowIdleView
  | TrustedDeviceFlowNewRequestView
  | TrustedDeviceFlowDisplayChallengeView
  | TrustedDeviceFlowDeviceTransferCompleteView
  | TrustedDeviceFlowDeviceTransferRejectedView
  | TrustedDeviceFlowErrorView
  | TrustedDeviceFlowLoadingChallengeView
  | undefined;
