import {
  ApproveDeviceRequestResponse,
  GetPendingDeviceRequestResponse,
} from "./trusted-device-flow.types";
export interface RefreshRequestEvent {
  type: "REFRESH_REQUEST";
}
export interface ApproveDeviceTransferRequestEvent {
  type: "APPROVE_REQUEST";
}
export interface RejectDeviceTransferRequestEvent {
  type: "REJECT_REQUEST";
}
export interface CancelDeviceTransferRequestEvent {
  type: "CANCEL_REQUEST";
}
export interface SubmitPassphraseChallengeEvent {
  type: "SUBMIT_PASSPHRASE_CHALLENGE";
  passphraseChallenge: string;
}
export interface GetPendingDeviceTransferRequestDoneEvent {
  type: `done.invoke.TrustedDeviceFlowMachine.WaitingForNewDeviceTransferRequest`;
  data: GetPendingDeviceRequestResponse;
}
export interface ApproveDeviceRequestDoneEvent {
  type: `done.invoke.TrustedDeviceFlowMachine.HandlingDeviceTransferRequest`;
  data: ApproveDeviceRequestResponse;
}
export interface ReturnToDeviceSetupEvent {
  type: "RETURN_TO_DEVICE_SETUP";
}
export type TrustedDeviceFlowMachineEvents =
  | GetPendingDeviceTransferRequestDoneEvent
  | RefreshRequestEvent
  | ApproveDeviceTransferRequestEvent
  | RejectDeviceTransferRequestEvent
  | CancelDeviceTransferRequestEvent
  | ApproveDeviceRequestDoneEvent
  | SubmitPassphraseChallengeEvent
  | ReturnToDeviceSetupEvent;
