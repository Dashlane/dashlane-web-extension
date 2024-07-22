import { EventHandler, IEventHandler } from "@dashlane/framework-application";
import {
  CarbonLegacyClient,
  CarbonLegacyEvent,
  LoginStatusChanged,
  OpenSessionSsoRedirectionToIdpRequired,
} from "@dashlane/communication";
import { AuthenticationFlow } from "../../services/authentication-flow.instance.service";
import { SsoUserSettingsStore } from "../../stores";
import { filter, firstValueFrom, map } from "rxjs";
import { isFailure, isSuccess, Result } from "@dashlane/framework-types";
export const EXT_NG_AUTHENTICATION_FLOW_KEY =
  "extng.loginFlow.forceLegacyFallback";
@EventHandler(CarbonLegacyEvent)
export class CarbonLegacyEventHandler
  implements IEventHandler<CarbonLegacyEvent>
{
  constructor(
    private authenticationFlow: AuthenticationFlow,
    private ssoUserSettingsStore: SsoUserSettingsStore,
    private carbon: CarbonLegacyClient
  ) {}
  getLoginFlowMigrationKillswitch() {
    return firstValueFrom(
      this.carbon.queries
        .carbonState({
          path: "device.killswitch.disableLoginFlowMigration",
        })
        .pipe(
          filter(isSuccess),
          map((state) => state as Result<boolean>)
        )
    );
  }
  async handle(event: CarbonLegacyEvent) {
    const isKillSwitchEnabled = await this.getLoginFlowMigrationKillswitch();
    let isForceLoginFlowFallbackOptionEnabled = false;
    if (typeof self !== "undefined" && self.localStorage) {
      const extngLoginFlowOption = self.localStorage.getItem(
        EXT_NG_AUTHENTICATION_FLOW_KEY
      );
      isForceLoginFlowFallbackOptionEnabled =
        Boolean(extngLoginFlowOption) && extngLoginFlowOption === "true";
    }
    if (
      (isKillSwitchEnabled.tag === "success" && isKillSwitchEnabled.data) ||
      isForceLoginFlowFallbackOptionEnabled
    ) {
      console.warn(
        "[Authentication-flow] Ignoring carbon event due to legacy login fallback",
        { isKillSwitchEnabled, isForceLoginFlowFallbackOptionEnabled }
      );
      return Promise.resolve();
    }
    switch (event.body.eventName) {
      case "openSessionMasterPasswordLess":
        this.authenticationFlow.continue({
          type: "CARBON_LEGACY_OPEN_SESSION_DEVICE_TO_DEVICE",
        });
        break;
      case "openSessionTokenSent":
        if (
          !event.body.eventData ||
          typeof event.body.eventData !== "object" ||
          !("login" in event.body.eventData) ||
          typeof event.body.eventData.login !== "string"
        ) {
          throw new Error("login not in eventData");
        }
        this.authenticationFlow.continue({
          type: "CARBON_LEGACY_OPEN_SESSION_TOKEN_SENT",
          login: event.body.eventData.login,
        });
        break;
      case "openSessionAskMasterPassword":
        {
          const carbonKeys = await firstValueFrom(
            this.carbon.queries.getMasterPasswordAndServerKey()
          );
          if (isFailure(carbonKeys)) {
            throw new Error("Failed to get  server key from carbon");
          }
          const { serverKey } = carbonKeys.data;
          this.authenticationFlow.continue({
            type: "CARBON_LEGACY_ASK_MASTER_PASSWORD",
            serverKey,
          });
        }
        break;
      case "openSessionDashlaneAuthenticator":
        this.authenticationFlow.continue({
          type: "CARBON_LEGACY_OPEN_SESSION_DASHLANE_AUTHENTICATOR",
        });
        break;
      case "openSessionOTPSent":
      case "openSessionOTPForNewDeviceRequired":
        this.authenticationFlow.continue({
          type: "CARBON_LEGACY_OPEN_SESSION_OTP_SENT",
          otpVerificationMode:
            event.body.eventName === "openSessionOTPSent" ? "otp2" : "otp1",
        });
        break;
      case "openSessionSsoRedirectionToIdpRequired":
        {
          const eventData = event.body
            .eventData as OpenSessionSsoRedirectionToIdpRequired;
          const { rememberMeForSSOPreference } =
            await this.ssoUserSettingsStore.getState();
          this.authenticationFlow.continue({
            type: "CARBON_LEGACY_OPEN_SESSION_SSO_REDIRECTION_TO_IDP_REQUIRED",
            serviceProviderRedirectUrl: eventData.serviceProviderRedirectUrl,
            isNitroProvider: eventData.isNitroProvider,
            rememberMeForSSOPreference,
          });
        }
        break;
      case "openSessionFailed": {
        const eventData = event.body.eventData as {
          errorCode: string;
          additionalErrorInfo: string;
          displayErrorCode: boolean;
        };
        if (eventData.errorCode === "WRONG_PASSWORD") {
          return this.authenticationFlow.continue({
            type: "CARBON_WRONG_PASSWORD",
          });
        }
        return this.authenticationFlow.continue({
          type: "CARBON_LEGACY_ERROR",
          error: eventData.errorCode,
        });
      }
      case "loginStatusChanged":
        {
          const eventData = event.body.eventData as LoginStatusChanged;
          if (!eventData.loggedIn) {
            this.authenticationFlow.continue({
              type: "CARBON_LEGACY_LOGGED_OUT",
            });
          }
        }
        break;
      default:
        break;
    }
    return Promise.resolve();
  }
}
