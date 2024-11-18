import { Injectable } from "@dashlane/framework-application";
import { SessionClient } from "@dashlane/session-contracts";
import { CarbonLegacyClient } from "@dashlane/communication";
import { firstValueFrom } from "rxjs";
import { isSuccess } from "@dashlane/framework-types";
import { MpVerificationError } from "../master-password.events";
interface Params {
  login: string;
  masterPassword: string;
  isRememberMeEnabled: boolean;
  serverKey?: string;
}
@Injectable()
export class MasterPasswordService {
  public constructor(
    private carbon: CarbonLegacyClient,
    private session: SessionClient
  ) {}
  public async executeWithParams({
    login,
    masterPassword,
    isRememberMeEnabled,
    serverKey,
  }: Params) {
    try {
      const sessionsQuery = await firstValueFrom(
        this.session.queries.localSessions()
      );
      if (!isSuccess(sessionsQuery)) {
        throw new Error(
          "Failure querying the session module to get the sessions"
        );
      }
      if (login in sessionsQuery.data) {
        const result = await this.session.commands.openUserSession({
          email: login,
          rememberPassword: isRememberMeEnabled,
          sessionKey: {
            type: "mp",
            masterPassword,
            secondaryKey: serverKey,
          },
        });
        if (!isSuccess(result)) {
          throw new Error("Failed to open session");
        }
        return Promise.resolve();
      }
      const result = await this.carbon.commands.openSessionWithMasterPassword({
        login,
        password: masterPassword,
        rememberPassword: isRememberMeEnabled,
        requiredPermissions: undefined,
        loginType: "MasterPassword",
      });
      if (!isSuccess(result)) {
        throw new Error("Failed to open session in carbon");
      }
      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        const message =
          "exception" in error && error.exception instanceof Error
            ? error.exception.message
            : error.message;
        if (
          message.includes("WRONG_PASSWORD on openSessionWithMasterPassword")
        ) {
          return Promise.reject(new MpVerificationError());
        }
      }
      return Promise.reject(new Error("UNKNOWN_ERROR"));
    }
  }
}
