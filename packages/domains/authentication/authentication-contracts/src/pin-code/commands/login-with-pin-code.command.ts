import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { NoActivePinCodeError, WrongPinCodeError } from "../errors";
export interface LoginWithPinCodeCommandRequest {
  pinCode: string;
  email: string;
}
export type LoginWithPinError = WrongPinCodeError | NoActivePinCodeError;
export class LoginWithPinCodeCommand extends defineCommand<
  LoginWithPinCodeCommandRequest,
  undefined,
  LoginWithPinError
>({
  scope: UseCaseScope.Device,
}) {}
