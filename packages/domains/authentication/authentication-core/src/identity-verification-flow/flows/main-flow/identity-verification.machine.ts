import { assign, createMachine } from "xstate";
import { Injectable } from "@dashlane/framework-application";
import { IdentityVerificationMachineBaseContext } from "./types";
import {
  DeviceRegistrationContext,
  DeviceRegistrationMachine,
} from "../device-registration-flow/device-registration.machine";
import {
  TwoFactorAuthenticationContext,
  TwoFactorAuthenticationMachine,
} from "../two-factor-authentication-flow/two-factor-authentication.machine";
import { IdentityVerificationMachineEvents } from "./identity-verification.events";
import { composeState } from "../helpers/compose-state";
export type IdentityVerificationMachineContext =
  IdentityVerificationMachineBaseContext &
    DeviceRegistrationContext &
    TwoFactorAuthenticationContext & {
      ready: boolean;
      error?: string;
    };
@Injectable()
export class IdentityVerificationMachine {
  private deviceRegistrationMachine: DeviceRegistrationMachine;
  private twoFactorAuthenticationMachine: TwoFactorAuthenticationMachine;
  public constructor(
    deviceRegistrationMachine: DeviceRegistrationMachine,
    twoFactorIdentityVerificationMachine: TwoFactorAuthenticationMachine
  ) {
    this.deviceRegistrationMachine = deviceRegistrationMachine;
    this.twoFactorAuthenticationMachine = twoFactorIdentityVerificationMachine;
  }
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as IdentityVerificationMachineEvents,
          context: {} as IdentityVerificationMachineContext,
        },
        initial: "Starting",
        id: "IdentityVerificationFlowMachine",
        context: {
          ...this.deviceRegistrationMachine.desc().config.context,
          ...this.twoFactorAuthenticationMachine.desc().config.context,
          ready: false,
          shouldAskOTP: false,
        },
        states: {
          Starting: {
            entry: ["assignInitializationResults"],
          },
          DeviceRegistration: {
            ...composeState(this.deviceRegistrationMachine.desc().config),
          },
          TwoFactorAuthentication: {
            ...composeState(this.twoFactorAuthenticationMachine.desc().config),
            onDone: {
              target: "AuthenticationDone",
            },
          },
          AuthenticationDone: {
            type: "final" as const,
          },
        },
        on: {
          VERIFY_IDENTITY_WITH_TOKEN: {
            target: "DeviceRegistration.EmailToken",
            actions: ["assignAccountEmail"],
          },
          VERIFY_IDENTITY_WITH_DASHLANE_AUTHENTICATOR: {
            target: "DeviceRegistration.DashlaneAuthenticator",
            actions: ["assignAccountEmail"],
          },
          VERIFY_IDENTITY_WITH_TOTP: {
            target: "TwoFactorAuthentication",
            actions: ["assignAccountEmail"],
          },
          CANCEL_IDENTITY_VERIFICATION: {
            target: "Starting",
            actions: ["clearContext"],
          },
          CLEAR_ERROR: {
            actions: ["clearError"],
          },
        },
      },
      options: {
        actions: {
          ...this.deviceRegistrationMachine.desc().options.actions,
          ...this.twoFactorAuthenticationMachine.desc().options.actions,
          assignInitializationResults: assign({
            ready: () => true,
          }) as any,
          assignAccountEmail: assign({
            login: (
              _,
              event: {
                login: string;
              }
            ) => event.login,
          }) as any,
          clearContext: assign({
            login: () => "",
            shouldAskOTP: () => false,
            twoFactorAuthenticationOtpType: () => "totp",
            registrationMethod: () => undefined,
            emailToken: () => "",
            deviceName: () => "",
            isDashlaneAuthenticatorAvailable: () => false,
          }) as any,
          clearError: assign({
            error: () => undefined,
          }) as any,
        },
        services: {
          ...this.deviceRegistrationMachine.desc().options.services,
          ...this.twoFactorAuthenticationMachine.desc().options.services,
        },
        guards: {
          ...this.deviceRegistrationMachine.desc().options.guards,
          ...this.twoFactorAuthenticationMachine.desc().options.guards,
          isGrapheneDeviceRegistrationFlow: (
            context: IdentityVerificationMachineContext
          ) => (context.login ? context.login.includes("__REDACTED__") : false),
        },
      },
    };
  }
  public create() {
    const { config, options } = this.desc();
    return createMachine(config, options);
  }
}
