export interface InputPinCodeEvent {
  type: "INPUT_PIN_CODE";
  pinCode: string;
}
export interface SwitchToDeviceToDeviceAuthenticationEvent {
  type: "USE_DEVICE_TO_DEVICE_AUTHENTICATION";
}
export type PinCodeMachineEvents =
  | InputPinCodeEvent
  | SwitchToDeviceToDeviceAuthenticationEvent;
