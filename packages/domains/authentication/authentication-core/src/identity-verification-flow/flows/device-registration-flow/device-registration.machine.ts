import { Injectable } from "@dashlane/framework-application";
import { AnyEventObject, assign, createMachine } from "xstate";
import { IdentityVerificationMachineBaseContext } from "../main-flow/types";
import {
  AuthenticatorContext,
  DashlaneAuthenticatorMachine,
} from "./dashlane-authenticator/dashlane-authenticator.machine";
import {
  EmailTokenContext,
  EmailTokenMachine,
} from "./email-token/email-token.machine";
import {
  DashlaneAuthenticatorDoneEvent,
  DeviceRegistrationEvents,
  EmailTokenDoneEvent,
} from "./device-registration.events";
import { composeState } from "../helpers/compose-state";
export type DeviceRegistrationContext = IdentityVerificationMachineBaseContext &
  AuthenticatorContext &
  EmailTokenContext & {
    registrationMethod?: "email_token" | "dashlane_authenticator" | "otp";
    error?: string;
  };
@Injectable()
export class DeviceRegistrationMachine {
  private authenticatorMachine: DashlaneAuthenticatorMachine;
  private emailTokenMachine: EmailTokenMachine;
  public constructor(
    authenticatorMachine: DashlaneAuthenticatorMachine,
    emailTokenMachine: EmailTokenMachine
  ) {
    this.authenticatorMachine = authenticatorMachine;
    this.emailTokenMachine = emailTokenMachine;
  }
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as DeviceRegistrationEvents,
          context: {} as DeviceRegistrationContext,
          guards: {} as {
            type: string;
            isRegistrationMethodEmailToken: boolean;
            isRegistrationMethodOTP: null;
          },
        },
        id: "DeviceRegistrationMachine",
        context: {
          ...this.authenticatorMachine.desc().config.context,
          ...this.emailTokenMachine.desc().config.context,
          registrationMethod: undefined,
        },
        initial: "StartDeviceRegistration",
        states: {
          StartDeviceRegistration: {
            always: [
              { target: "EmailToken", cond: "isRegistrationMethodEmailToken" },
              {
                target: "DashlaneAuthenticator",
                cond: "isRegistrationMethodAuthenticator",
              },
              {
                target: "TwoFactorAuthentication",
                cond: "isRegistrationMethodOTP",
              },
            ],
          },
          DashlaneAuthenticator: {
            ...composeState(this.authenticatorMachine.desc().config),
            onDone: [
              {
                target: "EmailToken",
                cond: "shouldSwitchToEmailToken",
              },
              { target: "DeviceRegistrationDone" },
            ],
          },
          EmailToken: {
            ...composeState(this.emailTokenMachine.desc().config),
            onDone: [
              {
                target: "DashlaneAuthenticator",
                cond: "shouldSwitchToAuthenticator",
              },
              { target: "DeviceRegistrationDone" },
            ],
          },
          TwoFactorAuthentication: {
            onDone: {
              target: "DeviceRegistrationDone",
            },
          },
          DeviceRegistrationDone: {
            type: "final" as const,
          },
        },
      },
      options: {
        actions: {
          ...this.authenticatorMachine.desc().options.actions,
          ...this.emailTokenMachine.desc().options.actions,
          assignUnknownDeviceRegistrationError: assign({
            error: () => ({
              code: "unknown_error",
              data: {
                message: "Unknown device registration error",
              },
            }),
          }) as any,
        },
        services: {
          ...this.authenticatorMachine.desc().options.services,
          ...this.emailTokenMachine.desc().options.services,
        },
        guards: {
          ...this.authenticatorMachine.desc().options.guards,
          ...this.emailTokenMachine.desc().options.guards,
          isRegistrationMethodEmailToken: (
            context: DeviceRegistrationContext
          ) => {
            return context.registrationMethod === "email_token";
          },
          isRegistrationMethodOTP: (context: DeviceRegistrationContext) => {
            return context.registrationMethod === "otp";
          },
          isRegistrationMethodAuthenticator: (
            context: DeviceRegistrationContext
          ) => {
            return context.registrationMethod === "dashlane_authenticator";
          },
          shouldSwitchToEmailToken: (
            _context: DeviceRegistrationContext,
            event: AnyEventObject
          ) => {
            return (event as DashlaneAuthenticatorDoneEvent).data
              .switchToEmailToken;
          },
          shouldSwitchToAuthenticator: (
            _context: EmailTokenContext,
            event: AnyEventObject
          ) => {
            return (event as EmailTokenDoneEvent).data
              .switchToDashlaneAuthenticator;
          },
        },
      },
    };
  }
  public create() {
    const { config, options } = this.desc();
    return createMachine(config, options);
  }
}
