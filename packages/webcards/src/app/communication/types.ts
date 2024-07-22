export interface WebcardGeometry {
  width: number;
  height: number;
}
export type FeatureFlips = Record<string, boolean>;
export type GetInitialStateFunction = () => void;
export type CloseWebcardFunction = () => void;
export type SendWebcardGeometryFunction = (
  webcardGeometry: WebcardGeometry
) => void;
export type ActionType = string;
export enum InputType {
  Text = "text",
  Password = "password",
  OtpSecret = "otpSecret",
  CardNumber = "cardNumber",
  SecurityCode = "securityCode",
  ExpireDate = "expireDate",
  BIC = "BIC",
  IBAN = "IBAN",
}
