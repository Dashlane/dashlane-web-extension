import { filter, firstValueFrom, map, mergeAll, Observable } from "rxjs";
import {
  AllowedToFail,
  CommandHandler,
  CqrsClient,
  ICommandHandler,
} from "@dashlane/framework-application";
import { hasProperty, isSuccess, success } from "@dashlane/framework-types";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { CarbonLegacyClient } from "@dashlane/communication";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import { GetAuthenticationMethodsForLoginBodyData } from "@dashlane/server-sdk/v1";
import { AuthenticationFlowInfraContext } from "../../configurations";
interface SSOLoginMethod {
  type: "sso";
  ssoInfo: {
    serviceProviderUrl: string;
    migration?:
      | "sso_member_to_admin"
      | "mp_user_to_sso_member"
      | "sso_member_to_mp_user";
    isNitroProvider?: boolean;
  };
}
interface LocalUserAuthenticationState {
  deviceAccessKey: string;
  deviceRegisteredWithLegacyKey: boolean;
  ssoActivatedUser: boolean;
}
interface LocalUsersAuthenticationState {
  [login: string]: LocalUserAuthenticationState;
}
const isSSOLoginMethod = (
  result:
    | GetAuthenticationMethodsForLoginBodyData["verifications"][number]
    | undefined
): result is SSOLoginMethod => {
  return (
    !!result &&
    typeof result === "object" &&
    hasProperty(result, "type") &&
    result.type === "sso"
  );
};
@CommandHandler(AuthenticationFlowContracts.InitiateAutologinWithSSOCommand)
export class InitiateAutologinWithSSOCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.InitiateAutologinWithSSOCommand>
{
  private client: CqrsClient;
  private carbonLegacyClient: CarbonLegacyClient;
  private authenticationFlowInfraContext: AuthenticationFlowInfraContext;
  private serverApiClient: ServerApiClient;
  public constructor(
    carbonLegacyClient: CarbonLegacyClient,
    client: CqrsClient,
    authenticationFlowInfraContext: AuthenticationFlowInfraContext,
    serverApiClient: ServerApiClient,
    private allowToFail: AllowedToFail
  ) {
    this.client = client;
    this.carbonLegacyClient = carbonLegacyClient;
    this.authenticationFlowInfraContext = authenticationFlowInfraContext;
    this.serverApiClient = serverApiClient;
  }
  private getDeviceAccessKeys(
    login: string
  ): Observable<LocalUserAuthenticationState> {
    return this.carbonLegacyClient.queries
      .carbonState({
        path: "authentication.localUsers",
      })
      .pipe(
        filter(isSuccess),
        map((state) => {
          const localUsersState = state.data as LocalUsersAuthenticationState;
          return localUsersState[login];
        })
      );
  }
  private async checkSSOInfo(
    login: string
  ): Promise<SSOLoginMethod["ssoInfo"]> {
    const loginInfo = await firstValueFrom(
      this.getDeviceAccessKeys(login).pipe(
        map((state: LocalUserAuthenticationState) => {
          return this.serverApiClient.v1.authentication.getAuthenticationMethodsForLogin(
            {
              login: login,
              deviceAccessKey: state.deviceAccessKey,
              methods: [
                "email_token",
                "totp",
                "duo_push",
                "dashlane_authenticator",
              ],
            }
          );
        }),
        mergeAll(),
        filter(isSuccess),
        map((state) => state.data.data)
      )
    );
    const verificationMethod = loginInfo.verifications.find(isSSOLoginMethod);
    if (verificationMethod) {
      const ssoInfo = verificationMethod.ssoInfo;
      return {
        isNitroProvider: ssoInfo.isNitroProvider,
        serviceProviderUrl: ssoInfo.serviceProviderUrl,
      };
    } else {
      throw new Error("No SSO authentication available for the user");
    }
  }
  public async execute(
    request: AuthenticationFlowContracts.InitiateAutologinWithSSOCommand
  ) {
    const { login } = request.body;
    const { loginUserWithEnclaveSSO } =
      this.client.getClient(confidentialSSOApi).commands;
    await this.allowToFail.doOne(async () => {
      const ssoInfo = await this.checkSSOInfo(login);
      if (ssoInfo.isNitroProvider) {
        await loginUserWithEnclaveSSO({
          userEmailAddress: login,
          tabFocus: false,
        });
      } else {
        this.authenticationFlowInfraContext.redirectUserToExternalUrl({
          externalUrl: ssoInfo.serviceProviderUrl,
          tabFocus: false,
        });
      }
    }, "InitiateAutologinWithSSOCommandHandler.execute");
    return Promise.resolve(success(undefined));
  }
}
