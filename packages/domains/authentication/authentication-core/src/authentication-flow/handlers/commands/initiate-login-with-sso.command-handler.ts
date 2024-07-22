import { firstValueFrom, map } from "rxjs";
import { hasProperty, isSuccess, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  CqrsClient,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CarbonLegacyClient } from "@dashlane/communication";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { SsoUserSettingsStore } from "../../stores";
import { AuthenticationFlowInfraContext } from "../../configurations";
import { SSOSettingsData } from "../../flows/main-flow/types";
interface SSOInfo {
  isNitroProvider: boolean;
  serviceProviderUrl: string;
}
export const isSsoSettings = (result: unknown): result is SSOSettingsData => {
  return (
    !!result &&
    typeof result === "object" &&
    hasProperty(result, "ssoUser") &&
    hasProperty(result, "serviceProviderUrl")
  );
};
@CommandHandler(AuthenticationFlowContracts.InitiateLoginWithSSOCommand)
export class InitiateLoginWithSSOCommandHandler
  implements
    ICommandHandler<AuthenticationFlowContracts.InitiateLoginWithSSOCommand>
{
  private ssoUserSettingsStore: SsoUserSettingsStore;
  private carbonLegacyClient: CarbonLegacyClient;
  private client: CqrsClient;
  private authenticationFlowInfraContext: AuthenticationFlowInfraContext;
  public constructor(
    carbonLegacyClient: CarbonLegacyClient,
    client: CqrsClient,
    ssoUserSettingsStore: SsoUserSettingsStore,
    authenticationFlowInfraContext: AuthenticationFlowInfraContext
  ) {
    this.carbonLegacyClient = carbonLegacyClient;
    this.ssoUserSettingsStore = ssoUserSettingsStore;
    this.client = client;
    this.authenticationFlowInfraContext = authenticationFlowInfraContext;
  }
  private async retrieveSSOInfo(): Promise<SSOInfo> {
    const ssoSettingsData = await firstValueFrom(
      this.carbonLegacyClient.queries
        .carbonState({
          path: "userSession.ssoSettings",
        })
        .pipe(
          map((ssoSettingsState) => {
            if (
              !isSuccess(ssoSettingsState) ||
              !isSsoSettings(ssoSettingsState.data)
            ) {
              throw new Error(`SsoSettings is not of the expected type`);
            }
            return ssoSettingsState.data;
          })
        )
    );
    return {
      isNitroProvider: ssoSettingsData.isNitroProvider ?? false,
      serviceProviderUrl: ssoSettingsData.serviceProviderUrl,
    };
  }
  public async execute(
    request: AuthenticationFlowContracts.InitiateLoginWithSSOCommand
  ) {
    const { loginUserWithEnclaveSSO } =
      this.client.getClient(confidentialSSOApi).commands;
    const ssoInfo = await this.retrieveSSOInfo();
    const { login, rememberMeForSSOPreference } = request.body;
    await this.ssoUserSettingsStore.set({
      rememberMeForSSOPreference,
    });
    if (ssoInfo.isNitroProvider) {
      await loginUserWithEnclaveSSO({
        userEmailAddress: login,
      });
    } else {
      this.authenticationFlowInfraContext.redirectUserToExternalUrl({
        externalUrl: ssoInfo.serviceProviderUrl,
        tabFocus: true,
      });
    }
    return Promise.resolve(success(undefined));
  }
}
