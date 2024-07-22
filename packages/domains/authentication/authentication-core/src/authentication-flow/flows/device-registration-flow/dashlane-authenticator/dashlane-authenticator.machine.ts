import { Injectable } from "@dashlane/framework-application";
import { assign, createMachine } from "xstate";
import {
  AuthenticationGenericError,
  AuthenticationMachineBaseContext,
} from "../../main-flow/types";
import { SendEmailToken } from "../email-token/services";
import { DashlaneAuthenticatorService } from "./dashlane-authenticator.service";
type AuthenticatorError = AuthenticationGenericError;
export type AuthenticatorContext = AuthenticationMachineBaseContext & {
  error?: AuthenticatorError;
  isDashlaneAuthenticatorAvailable: boolean;
};
export interface SwitchToEmailTokenEvent {
  type: "SWITCH_TO_EMAIL_TOKEN";
}
export interface ResendPushNotificationEvent {
  type: "RESEND_PUSH_NOTIFICATION";
}
export interface CarbonLegacyErrorEvent {
  type: "CARBON_LEGACY_ERROR";
  error: string;
}
export interface ClearErrorEvent {
  type: "CLEAR_ERROR";
}
export type AuthenticatorEvents =
  | CarbonLegacyErrorEvent
  | ClearErrorEvent
  | ResendPushNotificationEvent
  | SwitchToEmailTokenEvent;
@Injectable()
export class DashlaneAuthenticatorMachine {
  private dashlaneAuthenticatorService: DashlaneAuthenticatorService;
  private sendEmailToken: SendEmailToken;
  public constructor(
    authenticateWithDashlaneAuthenticator: DashlaneAuthenticatorService,
    sendEmailToken: SendEmailToken
  ) {
    this.dashlaneAuthenticatorService = authenticateWithDashlaneAuthenticator;
    this.sendEmailToken = sendEmailToken;
  }
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as AuthenticatorEvents,
          context: {} as AuthenticatorContext,
        },
        id: "AuthenticatorMachine",
        context: {
          isDashlaneAuthenticatorAvailable: false,
        },
        initial: "RequestingServerPush",
        states: {
          RequestingServerPush: {
            entry: ["updateDashlaneAuthenticatorAvailability"],
            invoke: {
              src: "authenticateWithDashlaneAuthenticator",
            },
            on: {
              CARBON_LEGACY_ERROR: {
                actions: [
                  "assignError",
                  "updateDashlaneAuthenticatorAvailability",
                ],
              },
              RESEND_PUSH_NOTIFICATION: {
                target: "RequestingServerPush",
                actions: ["clearError"],
              },
              SWITCH_TO_EMAIL_TOKEN: {
                actions: ["cancelDashlaneAuthenticator", "clearError"],
                target: "EmailTokenRequested",
              },
            },
          },
          AuthenticatorPushValidated: {
            type: "final" as const,
            data: {
              switchToEmailToken: false,
            },
          },
          EmailTokenRequested: {
            entry: ["sendEmailToken"],
            type: "final" as const,
            data: {
              switchToEmailToken: true,
            },
          },
        },
      },
      options: {
        actions: {
          clearError: assign({
            error: () => undefined,
          }) as any,
          assignError: assign({
            error: (_, event: CarbonLegacyErrorEvent) => ({
              code: "unknown_error",
              data: {
                message: event.error,
              },
            }),
          }) as any,
          switchToEmailToken: assign({
            switchToEmailToken: () => true,
          }) as any,
          updateDashlaneAuthenticatorAvailability: assign({
            isDashlaneAuthenticatorAvailable: true,
          }) as any,
          cancelDashlaneAuthenticator: () => {
            void this.dashlaneAuthenticatorService.cancel();
          },
          sendEmailToken: (context: AuthenticatorContext) => {
            const { login } = context;
            void this.sendEmailToken.execute({
              login,
            });
          },
        },
        services: {
          authenticateWithDashlaneAuthenticator: (
            context: AuthenticatorContext
          ) => {
            const { login } = context;
            return this.dashlaneAuthenticatorService.execute({
              login,
            });
          },
        },
        guards: {},
      },
    };
  }
  public create() {
    const { config, options } = this.desc();
    return createMachine(config, options);
  }
}
