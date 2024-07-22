import { Injectable } from "@dashlane/framework-application";
import { assign, createMachine } from "xstate";
import {
  AuthenticationGenericError,
  AuthenticationMachineBaseContext,
} from "../../main-flow/types";
import { AuthenticateWithEmailToken, SendEmailToken } from "./services";
type EmailTokenError = AuthenticationGenericError;
export type EmailTokenContext = AuthenticationMachineBaseContext & {
  deviceName?: string;
  emailToken?: string;
  error?: EmailTokenError;
};
export interface InputEmailTokenEvent {
  type: "INPUT_EMAIL_TOKEN";
  emailToken: string;
  deviceName: string;
}
export interface SendEmailTokenEvent {
  type: "SEND_EMAIL_TOKEN";
}
export interface ResendEmailTokenEvent {
  type: "RESEND_EMAIL_TOKEN";
}
export interface SwitchToDashlaneAuthenticatorEvent {
  type: "SWITCH_TO_DASHLANE_AUTHENTICATOR";
}
export interface CarbonLegacyErrorEvent {
  type: "CARBON_LEGACY_ERROR";
  error: string;
}
export interface ClearErrorEvent {
  type: "CLEAR_ERROR";
}
export type EmailTokenEvents =
  | ResendEmailTokenEvent
  | CarbonLegacyErrorEvent
  | ClearErrorEvent
  | InputEmailTokenEvent
  | SendEmailTokenEvent
  | SwitchToDashlaneAuthenticatorEvent;
@Injectable()
export class EmailTokenMachine {
  private authenticateWithEmailToken: AuthenticateWithEmailToken;
  private sendEmailToken: SendEmailToken;
  public constructor(
    authenticateWithEmailToken: AuthenticateWithEmailToken,
    sendEmailToken: SendEmailToken
  ) {
    this.authenticateWithEmailToken = authenticateWithEmailToken;
    this.sendEmailToken = sendEmailToken;
  }
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as EmailTokenEvents,
          context: {} as EmailTokenContext,
        },
        id: "EmailTokenMachine",
        context: {
          login: "",
          emailToken: "",
          deviceName: "",
        },
        initial: "WaitingForEmailToken",
        states: {
          SendEmailToken: {
            invoke: {
              src: "sendEmailToken",
              onError: {
                target: "WaitingForEmailToken",
              },
              onDone: {
                target: "WaitingForEmailToken",
              },
            },
          },
          WaitingForEmailToken: {
            on: {
              INPUT_EMAIL_TOKEN: {
                target: "ValidatingEmailToken",
                actions: ["assignEmailToken"],
              },
              RESEND_EMAIL_TOKEN: {
                target: "SendEmailToken",
                actions: ["clearError"],
              },
            },
          },
          ValidatingEmailToken: {
            entry: ["authenticateWithEmailToken"],
            on: {
              CARBON_LEGACY_ERROR: {
                target: "WaitingForEmailToken",
                actions: ["assignError"],
              },
            },
          },
          FinishingEmailToken: {
            type: "final" as const,
            data: {
              switchToDashlaneAuthenticator: false,
            },
          },
          DashlaneAuthenticatorRequested: {
            type: "final" as const,
            data: {
              switchToDashlaneAuthenticator: true,
            },
          },
        },
        on: {
          SWITCH_TO_DASHLANE_AUTHENTICATOR: {
            target: ".DashlaneAuthenticatorRequested",
            internal: true,
            actions: ["clearError"],
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
          assignEmailToken: assign({
            emailToken: (_, event: InputEmailTokenEvent) => event.emailToken,
          }) as any,
          authenticateWithEmailToken: (context: EmailTokenContext) => {
            const { deviceName, emailToken, login } = context;
            return this.authenticateWithEmailToken.execute({
              deviceName,
              emailToken,
              login,
            });
          },
        },
        services: {
          sendEmailToken: (context: EmailTokenContext) => {
            const { login } = context;
            return this.sendEmailToken.execute({
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
