import {
  defineFunctionalError,
  FunctionalErrorOf,
} from "@dashlane/framework-types";
export const WRONG_PIN_CODE = "WRONG_PIN_CODE" as const;
export const createWrongPinCodeError = defineFunctionalError(
  WRONG_PIN_CODE,
  "Entered pin-code is not correct"
);
export type WrongPinCodeError = FunctionalErrorOf<typeof WRONG_PIN_CODE>;
export const NO_ACTIVE_PIN_CODE = "NO_ACTIVE_PIN_CODE" as const;
export const createNoActivePinCodeError = defineFunctionalError(
  NO_ACTIVE_PIN_CODE,
  "User has no active pin-code"
);
export type NoActivePinCodeError = FunctionalErrorOf<typeof NO_ACTIVE_PIN_CODE>;
export type ComputePinKeyError = WrongPinCodeError | NoActivePinCodeError;
