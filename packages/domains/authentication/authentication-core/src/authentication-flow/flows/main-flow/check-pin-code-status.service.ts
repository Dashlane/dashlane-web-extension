import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { PinCodeClient } from "@dashlane/authentication-contracts";
import { isSuccess } from "@dashlane/framework-types";
interface Params {
  login?: string;
}
@Injectable()
export class CheckPinCodeStatusService {
  public constructor(private pinCodeClient: PinCodeClient) {}
  public async execute({ login }: Params) {
    if (login) {
      const pinCodeInformation = await firstValueFrom(
        this.pinCodeClient.queries.getStatus({ loginEmail: login })
      );
      if (
        isSuccess(pinCodeInformation) &&
        pinCodeInformation.data.isPinCodeEnabled
      ) {
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }
}
