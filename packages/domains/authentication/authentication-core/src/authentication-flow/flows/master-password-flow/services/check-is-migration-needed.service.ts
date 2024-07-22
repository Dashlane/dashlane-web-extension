import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { isFailure, match, panic } from "@dashlane/framework-types";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { GetAuthenticationMethodsForDeviceBodyData } from "@dashlane/server-sdk/v1";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { SsoProviderInfoStore } from "../../../stores";
import { SSOMigrationResult } from "../master-password.events";
export const isVericationMethodsAvailable = (
  result: GetAuthenticationMethodsForDeviceBodyData["verifications"][number]
): result is AuthenticationFlowContracts.VerificationMethod => {
  return typeof result === "object" && "type" in result;
};
interface Params {
  login: string;
}
interface SsoInfo {
  serviceProviderUrl: string;
  isNitroProvider?: boolean;
  migration?:
    | "sso_member_to_admin"
    | "mp_user_to_sso_member"
    | "sso_member_to_mp_user";
}
const getSSOmigrationType = (
  migration: string | undefined
): AuthenticationFlowContracts.SSOMigrationType | undefined => {
  if (!migration) {
    return undefined;
  }
  switch (migration) {
    case "sso_member_to_admin":
      return AuthenticationFlowContracts.SSOMigrationType.SSO_TO_MP;
    case "sso_member_to_mp_user":
      return AuthenticationFlowContracts.SSOMigrationType.SSO_TO_MP;
    case "mp_user_to_sso_member":
      return AuthenticationFlowContracts.SSOMigrationType.MP_TO_SSO;
    default:
      return undefined;
  }
};
@Injectable()
export class CheckIsMigrationNeededService {
  public constructor(
    private ssoProviderInfoStore: SsoProviderInfoStore,
    private serverApiClient: ServerApiClient
  ) {
    this.ssoProviderInfoStore = ssoProviderInfoStore;
    this.serverApiClient = serverApiClient;
  }
  private async getSsoMigration(login: string): Promise<SsoInfo | undefined> {
    const verificationMethodsRequest = await firstValueFrom(
      this.serverApiClient.v1.authentication.getAuthenticationMethodsForDevice({
        login: login,
        methods: [
          "email_token",
          "totp",
          "duo_push",
          "dashlane_authenticator",
          "u2f",
        ],
      })
    );
    if (isFailure(verificationMethodsRequest)) {
      return match(verificationMethodsRequest.error, {
        FetchFailedError: () => undefined,
        BusinessError: () => panic("Retrieve of verificationMethods failed"),
        InternalServerError: () =>
          panic("Retrieve of verificationMethods failed"),
        InvalidRequest: () => panic("Retrieve of verificationMethods failed"),
        RateLimited: () => panic("Retrieve of verificationMethods failed"),
        ServiceUnavailable: () =>
          panic("Retrieve of verificationMethods failed"),
        UnspecifiedBadStatus: () =>
          panic("Retrieve of verificationMethods failed"),
      });
    }
    const validVerification =
      verificationMethodsRequest.data.data.verifications.find(
        isVericationMethodsAvailable
      );
    if (!validVerification) {
      throw new Error("No valid verification method");
    }
    if (validVerification.type !== "sso") {
      return undefined;
    }
    return {
      serviceProviderUrl: validVerification.ssoInfo.serviceProviderUrl,
      isNitroProvider: validVerification.ssoInfo.isNitroProvider,
      migration: validVerification.ssoInfo.migration,
    };
  }
  public async executeWithParams({
    login,
  }: Params): Promise<SSOMigrationResult | undefined> {
    const ssoInfo = await this.getSsoMigration(login);
    if (!ssoInfo) {
      return undefined;
    }
    await this.ssoProviderInfoStore.set({
      isNitroProvider: ssoInfo.isNitroProvider ?? false,
      serviceProviderUrl: ssoInfo.serviceProviderUrl,
      migrationType: getSSOmigrationType(ssoInfo.migration),
    });
    return {
      serviceProviderRedirectUrl: ssoInfo.serviceProviderUrl,
      isNitroProvider: ssoInfo.isNitroProvider,
    } as SSOMigrationResult;
  }
}
