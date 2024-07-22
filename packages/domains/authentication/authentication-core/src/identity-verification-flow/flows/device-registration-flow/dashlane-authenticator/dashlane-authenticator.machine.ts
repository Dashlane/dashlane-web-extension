import { Injectable } from "@dashlane/framework-application";
import { assign, createMachine } from "xstate";
import { IdentityVerificationMachineBaseContext } from "../../main-flow/types";
import { SendEmailToken } from "../email-token/services";
import { DashlaneAuthenticatorService } from "./dashlane-authenticator.service";
import {
  CarbonLegacyErrorEvent,
  ClearErrorEvent,
} from "../device-registration.events";
import {
  DashlaneAuthenticatorErrorCode,
  DefaultErrorCode,
} from "../../../types/errors";
export type AuthenticatorContext = IdentityVerificationMachineBaseContext & {
  error?: string;
  isDashlaneAuthenticatorAvailable: boolean;
};
export interface SwitchToEmailTokenEvent {
  type: "SWITCH_TO_EMAIL_TOKEN";
}
export interface ResendPushNotificationEvent {
  type: "RESEND_PUSH_NOTIFICATION";
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
              onDone: { target: "AuthenticatorPushValidated" },
              onError: {
                actions: [
                  "assignError",
                  "updateDashlaneAuthenticatorAvailability",
                ],
              },
            },
            on: {
              RESEND_PUSH_NOTIFICATION: {
                target: "RequestingServerPush",
                actions: ["clearError"],
              },
              SWITCH_TO_EMAIL_TOKEN: {
                actions: ["clearError"],
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
            error: (
              _,
              event: {
                data: DashlaneAuthenticatorErrorCode | DefaultErrorCode;
              }
            ) => event.data,
          }) as any,
          switchToEmailToken: assign({
            switchToEmailToken: () => true,
          }) as any,
          updateDashlaneAuthenticatorAvailability: assign({
            isDashlaneAuthenticatorAvailable: true,
          }) as any,
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
