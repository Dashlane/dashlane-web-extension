import { isSuccess } from "@dashlane/framework-types";
import { SessionClient } from "@dashlane/session-contracts";
import { firstValueFrom } from "rxjs";
import { MpVerificationError } from "../master-password.events";
import { Injectable } from "@dashlane/framework-application";
@Injectable()
export class MasterPasswordVerificationService {
  constructor(private session: SessionClient) {}
  public async executeWithParams(params: {
    login: string;
    masterPassword: string;
    serverKey?: string;
  }) {
    const skVerificationQuery = await firstValueFrom(
      this.session.queries.checkSessionKey({
        email: params.login,
        sessionKey: {
          type: "mp",
          masterPassword: params.masterPassword,
          secondaryKey: params.serverKey,
        },
      })
    );
    if (!isSuccess(skVerificationQuery)) {
      throw new Error("Error verifying SK");
    }
    if (skVerificationQuery.data) {
      return true;
    }
    throw new MpVerificationError();
  }
}
