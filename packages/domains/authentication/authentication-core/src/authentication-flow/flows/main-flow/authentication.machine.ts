import { AnyEventObject, assign, createMachine } from "xstate";
import { Injectable } from "@dashlane/framework-application";
import { appendOnErrorsToStateMachine } from "@dashlane/xstate-utils";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  AuthenticationGenericError,
  AuthenticationMachineBaseContext,
} from "./types";
import {
  MasterPasswordFlowContext,
  MasterPasswordFlowMachine,
} from "../master-password-flow/master-password.machine";
import {
  DeviceRegistrationContext,
  DeviceRegistrationMachine,
} from "../device-registration-flow/device-registration.machine";
import {
  WebAuthnContext,
  WebAuthnFlowMachine,
} from "../webauthn-flow/webauthn.machine";
import {
  TwoFactorAuthenticationContext,
  TwoFactorAuthenticationMachine,
} from "../two-factor-authentication-flow/two-factor-authentication.machine";
import {
  DeviceToDeviceAuthenticationFlowContext,
  DeviceToDeviceAuthenticationFlowMachine,
} from "../device-to-device-authentication-flow";
import {
  PinCodeMachine,
  PinCodeMachineContext,
} from "../pin-code-flow/pin-code.machine";
import {
  AuthenticationMachineEvents,
  CarbonLegacyEmailTokenSentEvent,
  CarbonLegacyErrorEvent,
  CarbonLegacyOtpSentEvent,
  CarbonLegacySsoRedirectionToIdpRequiredEvent,
  CheckPinEnabledForAccountDoneEvent,
  InitializationDoneEvent,
  InputAccountEmailEvent,
  InputChangeAccountEmailEvent,
  LegacySSOLoginEvent,
  MasterPasswordFinishedEvent,
  WebAuthnDoneEvent,
} from "./authentication.events";
import { InitializeMachineService } from "./initialize.service";
import { LegacySSOLoginService } from "./sso.service";
import { StoreSSOInfoService } from "./store-sso-info.service";
import { CheckAccountTypeService } from "./check-account-type.service";
import { CheckPinCodeStatusService } from "./check-pin-code-status.service";
import { composeState } from "../helpers/compose-state";
type AuthenticationMachineError = AuthenticationGenericError;
export type AuthenticationMachineContext = AuthenticationMachineBaseContext &
  DeviceRegistrationContext &
  MasterPasswordFlowContext &
  TwoFactorAuthenticationContext &
  DeviceToDeviceAuthenticationFlowContext &
  PinCodeMachineContext &
  WebAuthnContext & {
    ready: boolean;
    shouldAskMasterPassword: boolean;
    shouldAskOTP: boolean;
    shouldAskPinCode: boolean;
    rememberMeType?: AuthenticationFlowContracts.RememberMeType;
    error?: AuthenticationMachineError;
    serviceProviderRedirectUrl?: string;
    localAccounts?: AuthenticationFlowContracts.LocalAccount[];
    isNitroProvider?: boolean;
    ssoData?: AuthenticationFlowContracts.LoginViaSSORequest;
    rememberMeForSSOPreference?: boolean;
  };
@Injectable()
export class AuthenticationMachine {
  public constructor(
    private deviceRegistrationMachine: DeviceRegistrationMachine,
    private masterPasswordFlowMachine: MasterPasswordFlowMachine,
    private twoFactorAuthenticationMachine: TwoFactorAuthenticationMachine,
    private webAuthnMachine: WebAuthnFlowMachine,
    private deviceToDeviceAuthenticationMachine: DeviceToDeviceAuthenticationFlowMachine,
    private pinCodeMachine: PinCodeMachine,
    private initializeMachineService: InitializeMachineService,
    private legacySSOLoginService: LegacySSOLoginService,
    private checkAccountType: CheckAccountTypeService,
    private storeSSOInfoService: StoreSSOInfoService,
    private checkPinCodeStatusService: CheckPinCodeStatusService
  ) {}
  public desc(withDebugLogs = false) {
    const base = {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as AuthenticationMachineEvents,
          context: {} as AuthenticationMachineContext,
        },
        initial: "Starting",
        id: "AuthenticationFlowMachine",
        context: {
          ...this.deviceRegistrationMachine.desc().config.context,
          ...this.masterPasswordFlowMachine.desc().config.context,
          ...this.twoFactorAuthenticationMachine.desc().config.context,
          ...this.webAuthnMachine.desc().config.context,
          ...this.deviceToDeviceAuthenticationMachine.desc().config.context,
          ...this.pinCodeMachine.desc().config.context,
          ready: false,
          shouldAskMasterPassword: false,
          shouldAskOTP: false,
          shouldAskPinCode: false,
        },
        states: {
          Starting: {
            invoke: {
              src: "initializeMachine",
              onDone: {
                actions: ["assignInitializationResults"],
                target: "RememberMeRedirection",
              },
            },
          },
          RememberMeRedirection: {
            always: [
              { target: "MasterPassword", cond: "shouldAskMasterPassword" },
              { target: "CheckSessionForOtp2", cond: "shouldAskOTP" },
              { target: "WebAuthn", cond: "rememberMeIsWebAuthn" },
              { target: "WaitingForEmail" },
            ],
          },
          CheckSessionForOtp2: {
            entry: ["checkAccountType"],
          },
          WaitingForEmail: {
            on: {
              INPUT_ACCOUNT_EMAIL: {
                target: "ValidatingEmail",
                actions: ["assignAccountEmail", "clearError"],
              },
            },
          },
          ValidatingEmail: {
            entry: ["checkAccountType"],
            on: {
              CARBON_LEGACY_ERROR: {
                target: "WaitingForEmail",
                actions: ["assignError"],
              },
            },
          },
          PinCode: {
            ...composeState(this.pinCodeMachine.desc().config),
          },
          DeviceRegistration: {
            ...composeState(this.deviceRegistrationMachine.desc().config),
          },
          WebAuthn: {
            ...composeState(this.webAuthnMachine.desc().config),
            onDone: [
              {
                target: "MasterPassword",
                cond: "shouldSwitchToMasterPassword",
              },
              {
                target: "PinCode",
                cond: "shouldSwitchToPinCode",
              },
              { target: "MasterPasswordBasedAuthenticationDone" },
            ],
          },
          TwoFactorAuthentication: {
            ...composeState(this.twoFactorAuthenticationMachine.desc().config),
            onDone: {
              target: "MasterPasswordBasedAuthenticationDone",
            },
          },
          SSOAuthentication: {
            entry: ["legacySSOLogin"],
          },
          SSORedirectionToIdp: {
            entry: ["assignServiceProviderInfo", "storeSSOInfo"],
            on: {
              CARBON_LEGACY_ERROR: {
                target: "WaitingForEmail",
                actions: ["assignError"],
              },
            },
          },
          CheckPinCodeAvailableForMasterPassword: {
            invoke: {
              src: "checkPinCodeStatus",
              onDone: [
                {
                  actions: ["assignShouldAskPinCode"],
                  cond: "isPinCodeLogin",
                  target: "PinCode",
                },
                {
                  actions: ["assignShouldAskPinCode"],
                  target: "MasterPassword",
                },
              ],
            },
          },
          MasterPassword: {
            ...composeState(this.masterPasswordFlowMachine.desc().config),
            onDone: [
              {
                target: "WaitingForEmail",
                cond: "shouldResetAuthenticationFlow",
              },
              { target: "MasterPasswordBasedAuthenticationDone" },
            ],
          },
          MasterPasswordBasedAuthenticationDone: {
            on: {
              CARBON_LEGACY_LOGGED_OUT: {
                target: "Starting",
              },
            },
          },
          CheckPinCodeAvailableForPasswordless: {
            invoke: {
              src: "checkPinCodeStatus",
              onDone: [
                {
                  actions: ["assignShouldAskPinCode"],
                  cond: "isPinCodeLogin",
                  target: "PinCode",
                },
                {
                  actions: ["assignShouldAskPinCode"],
                  target: "DeviceToDeviceAuthentication",
                },
              ],
            },
          },
          DeviceToDeviceAuthentication: {
            ...composeState(
              this.deviceToDeviceAuthenticationMachine.desc().config
            ),
            onDone: {
              target: "DeviceToDeviceAuthenticationDone",
            },
          },
          DeviceToDeviceAuthenticationDone: {
            type: "final" as const,
          },
        },
        on: {
          CHANGE_ACCOUNT_EMAIL: [
            {
              target: "ValidatingEmail",
              actions: ["clearError", "assignAccountEmail"],
              cond: "isAccountLoginAvailable",
            },
            {
              target: "WaitingForEmail",
              actions: ["clearError", "clearEmail"],
            },
          ],
          CARBON_LEGACY_ASK_MASTER_PASSWORD: {
            target: "CheckPinCodeAvailableForMasterPassword",
            actions: ["assignServerKey", "clearError"],
          },
          CARBON_LEGACY_OPEN_SESSION_TOKEN_SENT: [
            {
              target: "DeviceRegistration.EmailToken",
              actions: ["assignAccountEmail", "clearError"],
              cond: "isGrapheneDeviceRegistrationFlow",
            },
            {
              target: "DeviceRegistration.EmailToken",
              actions: ["assignAccountEmail", "clearError"],
            },
          ],
          CARBON_LEGACY_OPEN_SESSION_DASHLANE_AUTHENTICATOR: {
            target: "DeviceRegistration.DashlaneAuthenticator",
            actions: ["clearError"],
          },
          CARBON_LEGACY_OPEN_SESSION_SSO_REDIRECTION_TO_IDP_REQUIRED: {
            target: "SSORedirectionToIdp",
            actions: ["clearError"],
          },
          CARBON_LEGACY_SSO_LOGIN_BYPASS: {
            target: "SSOAuthentication",
            actions: ["assignSsoData"],
          },
          CARBON_LEGACY_OPEN_SESSION_OTP_SENT: {
            target: "TwoFactorAuthentication",
            actions: ["assignOtpVerificationMode", "clearError"],
          },
          CARBON_LEGACY_OPEN_SESSION_DEVICE_TO_DEVICE: {
            target: "CheckPinCodeAvailableForPasswordless",
            actions: ["assignServerKey", "clearError"],
          },
          CLEAR_ERROR: {
            actions: ["clearError"],
          },
        },
      },
      options: {
        actions: {
          ...this.deviceRegistrationMachine.desc().options.actions,
          ...this.masterPasswordFlowMachine.desc().options.actions,
          ...this.twoFactorAuthenticationMachine.desc().options.actions,
          ...this.webAuthnMachine.desc().options.actions,
          ...this.deviceToDeviceAuthenticationMachine.desc().options.actions,
          ...this.pinCodeMachine.desc().options.actions,
          assignInitializationResults: assign({
            login: (_, event: InitializationDoneEvent) =>
              event.data.lastUsedLogin,
            localAccounts: (_, event: InitializationDoneEvent) =>
              event.data.localAccounts,
            shouldAskMasterPassword: (_, event: InitializationDoneEvent) =>
              event.data.shouldAskMasterPassword,
            shouldAskOTP: (_, event: InitializationDoneEvent) =>
              event.data.shouldAskOTP,
            shouldAskPinCode: (_, event: InitializationDoneEvent) =>
              event.data.shouldAskPinCode,
            rememberMeType: (_, event: InitializationDoneEvent) =>
              event.data.rememberMeType,
            ready: () => true,
          }) as any,
          assignAccountEmail: assign({
            login: (
              _,
              event:
                | InputAccountEmailEvent
                | InputChangeAccountEmailEvent
                | CarbonLegacyEmailTokenSentEvent
            ) => event.login,
          }) as any,
          assignError: assign({
            error: (_, event: CarbonLegacyErrorEvent) => ({
              code: "unknown_error",
              data: {
                message: (event as CarbonLegacyErrorEvent).error,
              },
            }),
          }) as any,
          assignOtpVerificationMode: assign({
            otpVerificationMode: (_, event: CarbonLegacyOtpSentEvent) =>
              event.otpVerificationMode,
          }) as any,
          assignSsoData: assign({
            ssoData: (_, event: LegacySSOLoginEvent) => event,
          }) as any,
          assignServiceProviderInfo: assign({
            serviceProviderRedirectUrl: (
              _,
              event: CarbonLegacySsoRedirectionToIdpRequiredEvent
            ) => event.serviceProviderRedirectUrl,
            isNitroProvider: (_, event) => event.isNitroProvider,
            rememberMeForSSOPreference: (_, event) =>
              event.rememberMeForSSOPreference,
          }) as any,
          assignServerKey: assign({
            serverKey: (
              _,
              event: {
                serverKey?: string;
              }
            ) => event.serverKey,
          }) as any,
          assignShouldAskPinCode: assign({
            shouldAskPinCode: (_, event: AnyEventObject) =>
              (event as CheckPinEnabledForAccountDoneEvent).data,
          }) as any,
          clearEmail: assign({
            login: undefined,
          }) as any,
          clearError: assign({
            error: () => undefined,
          }) as any,
          clearContext: assign({
            login: () => "",
            shouldAskOTP: () => false,
            shouldAskMasterPassword: () => false,
            twoFactorAuthenticationOtpType: () => "totp",
            registrationMethod: () => undefined,
            emailToken: () => "",
            deviceName: () => "",
            isDashlaneAuthenticatorAvailable: () => false,
            isRememberMeEnabled: () => false,
            isAccountRecoveryAvailable: () => false,
          }) as any,
          legacySSOLogin: (
            _: AuthenticationMachineContext,
            event: LegacySSOLoginEvent
          ) => this.legacySSOLoginService.execute(event),
          checkAccountType: (context: AuthenticationMachineContext) =>
            this.checkAccountType.execute(context),
          storeSSOInfo: (
            _: AuthenticationMachineContext,
            event: CarbonLegacySsoRedirectionToIdpRequiredEvent
          ) => this.storeSSOInfoService.execute(event),
        },
        services: {
          ...this.deviceRegistrationMachine.desc().options.services,
          ...this.masterPasswordFlowMachine.desc().options.services,
          ...this.twoFactorAuthenticationMachine.desc().options.services,
          ...this.webAuthnMachine.desc().options.services,
          ...this.deviceToDeviceAuthenticationMachine.desc().options.services,
          ...this.pinCodeMachine.desc().options.services,
          initializeMachine: () => this.initializeMachineService.execute(),
          checkAccountType: (context: AuthenticationMachineContext) =>
            this.checkAccountType.execute(context),
          checkPinCodeStatus: (context: AuthenticationMachineContext) =>
            this.checkPinCodeStatusService.execute(context),
        },
        guards: {
          ...this.deviceRegistrationMachine.desc().options.guards,
          ...this.twoFactorAuthenticationMachine.desc().options.guards,
          ...this.webAuthnMachine.desc().options.guards,
          ...this.masterPasswordFlowMachine.desc().options.guards,
          isAccountLoginAvailable: (
            _: AuthenticationMachineContext,
            event: AnyEventObject
          ) => Boolean((event as InputChangeAccountEmailEvent).login),
          shouldAskMasterPassword: (context: AuthenticationMachineContext) => {
            return context.shouldAskMasterPassword && !context.shouldAskPinCode;
          },
          shouldAskOTP: (context: AuthenticationMachineContext) =>
            context.shouldAskOTP ? context.shouldAskOTP : false,
          shouldAskPinCode: (context: AuthenticationMachineContext) =>
            context.shouldAskPinCode,
          shouldSwitchToMasterPassword: (
            _: AuthenticationMachineContext,
            event: AnyEventObject
          ) => {
            return (event as WebAuthnDoneEvent).data.switchToMasterPassword;
          },
          shouldSwitchToPinCode: (
            _: AuthenticationMachineContext,
            event: AnyEventObject
          ) => {
            return (event as WebAuthnDoneEvent).data.switchToPinCode;
          },
          shouldResetAuthenticationFlow: (
            _: AuthenticationMachineContext,
            event: AnyEventObject
          ) => {
            return (event as MasterPasswordFinishedEvent).data
              .shouldResetAuthenticationFlow;
          },
          rememberMeIsWebAuthn: (context: AuthenticationMachineContext) =>
            context.rememberMeType !== undefined &&
            context.rememberMeType === "webauthn",
          isGrapheneDeviceRegistrationFlow: (
            context: AuthenticationMachineContext
          ) => (context.login ? context.login.includes("*****") : false),
          isPinCodeLogin: (
            _: AuthenticationMachineContext,
            event: AnyEventObject
          ) => event.data,
        },
      },
    };
    if (withDebugLogs) {
      appendOnErrorsToStateMachine(base.config);
    }
    return base;
  }
  public create(withDebugLogs = false) {
    const { config, options } = this.desc(withDebugLogs);
    return createMachine(config, options);
  }
}
