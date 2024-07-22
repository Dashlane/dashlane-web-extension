import {
  CompleteKeyExchangeAndGeneratePassphraseResponseData,
  RequestTransferResponseData,
  StartReceiverKeyExchangeResponseData,
  StartTransferResponseData,
} from "./device-to-device-authentication-flow.types";
export interface RequestTransferDoneEvent {
  type: `done.invoke.DeviceToDeviceAuthenticationFlow.WaitingForTransferRequest`;
  data: RequestTransferResponseData;
}
export interface CancelDeviceTransferRequestEvent {
  type: "CANCEL_DEVICE_TRANSFER_REQUEST";
}
export interface StartReceiverKeyExchangeDoneEvent {
  type: `done.invoke.DeviceToDeviceAuthenticationFlow.DisplayInstructions`;
  data: StartReceiverKeyExchangeResponseData;
}
export interface CompleteKeyExchangeAndGeneratePassphraseDoneEvent {
  type: `done.invoke.DeviceToDeviceAuthenticationFlow.GeneratePassphrase`;
  data: CompleteKeyExchangeAndGeneratePassphraseResponseData;
}
export interface StartTransferDoneEvent {
  type: `done.invoke.DeviceToDeviceAuthenticationFlow.StartTransfer`;
  data: StartTransferResponseData;
}
export type DeviceToDeviceAuthenticationFlowEvents =
  | RequestTransferDoneEvent
  | StartReceiverKeyExchangeDoneEvent
  | CompleteKeyExchangeAndGeneratePassphraseDoneEvent
  | StartTransferDoneEvent
  | CancelDeviceTransferRequestEvent;
