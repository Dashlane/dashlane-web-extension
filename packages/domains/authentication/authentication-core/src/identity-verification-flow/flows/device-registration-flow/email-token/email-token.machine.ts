import { Injectable } from "@dashlane/framework-application";
import { assign, createMachine } from "xstate";
import { DefaultErrorCode, EmailTokenErrorCode } from "../../../types/errors";
import { IdentityVerificationMachineBaseContext } from "../../main-flow/types";
import {
  CarbonLegacyErrorEvent,
  ClearErrorEvent,
} from "../device-registration.events";
import { AuthenticateWithEmailToken, SendEmailToken } from "./services";
export type EmailTokenContext = IdentityVerificationMachineBaseContext & {
  deviceName?: string;
  emailToken?: string;
  error?: string;
};
export interface InputEmailTokenEvent {
  type: "INPUT_EMAIL_TOKEN";
  emailToken: string;
  deviceName: string;
}
export interface SendEmailTokenEvent {
  type: "done.state.EmailTokenMachine.SendEmailToken";
}
export interface ResendEmailTokenEvent {
  type: "RESEND_EMAIL_TOKEN";
}
export interface SwitchToDashlaneAuthenticatorEvent {
  type: "SWITCH_TO_DASHLANE_AUTHENTICATOR";
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
        initial: "SendEmailToken",
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
            invoke: {
              src: "authenticateWithEmailToken",
              onDone: {
                target: "FinishingEmailToken",
              },
              onError: {
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
          assignError: assign({
            error: (
              _,
              event: {
                data: EmailTokenErrorCode | DefaultErrorCode;
              }
            ) => event.data,
          }) as any,
          clearError: assign({
            error: () => undefined,
          }) as any,
          assignEmailToken: assign({
            emailToken: (_, event: InputEmailTokenEvent) => event.emailToken,
          }) as any,
        },
        services: {
          sendEmailToken: (context: EmailTokenContext) => {
            const { login } = context;
            return this.sendEmailToken.execute({
              login,
            });
          },
          authenticateWithEmailToken: (context: EmailTokenContext) => {
            const { deviceName, emailToken, login } = context;
            return this.authenticateWithEmailToken.executeWithParams({
              deviceName,
              emailToken,
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
