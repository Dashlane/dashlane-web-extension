import { Injectable } from "@dashlane/framework-application";
import { isFailure, match } from "@dashlane/framework-types";
import { PinCodeClient } from "@dashlane/authentication-contracts";
import { XstateFunctionalError } from "@dashlane/xstate-utils";
interface Params {
  loginEmail?: string;
  pinCode: string;
}
export class WrongPinCodeError extends XstateFunctionalError {
  constructor() {
    super("Entered PIN code is wrong");
  }
}
@Injectable()
export class PinCodeVerificationService {
  public constructor(private pinCodeClient: PinCodeClient) {}
  public async executeWithParams({ loginEmail, pinCode }: Params) {
    if (!loginEmail) {
      throw new Error("No login email");
    }
    const result = await this.pinCodeClient.commands.loginWithPinCode({
      email: loginEmail,
      pinCode,
    });
    if (isFailure(result)) {
      return Promise.reject(
        match(result.error, {
          NO_ACTIVE_PIN_CODE: () => new Error("No active pin code"),
          WRONG_PIN_CODE: () => new WrongPinCodeError(),
        })
      );
    }
    return Promise.resolve();
  }
}
