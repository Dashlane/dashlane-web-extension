import { assign, createMachine } from "xstate";
import { Injectable } from "@dashlane/framework-application";
import {
  AuthenticationGenericError,
  AuthenticationMachineBaseContext,
} from "../main-flow/types";
import {
  WebAuthnAuthenticationFailEvent,
  WebAuthnEvents,
} from "./webauthn.events";
type WebAuthnError = AuthenticationGenericError;
export type WebAuthnContext = AuthenticationMachineBaseContext & {
  error?: WebAuthnError;
};
@Injectable()
export class WebAuthnFlowMachine {
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as WebAuthnEvents,
          context: {} as WebAuthnContext,
        },
        id: "WebAuthnMachine",
        context: {},
        initial: "InitWebAuthnAuthentication",
        states: {
          InitWebAuthnAuthentication: {
            on: {
              WEBAUTHN_AUTHENTICATION_FAIL: {
                target: "WebAuthnAuthenticationFailed",
                actions: ["assignWebAuthnError"],
              },
            },
          },
          WebAuthnAuthenticationFailed: {
            on: {
              RETRY_WEBAUTHN_AUTHENTICATION: {
                target: "InitWebAuthnAuthentication",
                actions: ["clearError"],
              },
            },
          },
          WebAuthnAuthenticationDone: {
            type: "final" as const,
            data: {
              switchToMasterPassword: false,
              switchToPinCode: false,
            },
          },
          MasterPasswordRequested: {
            type: "final" as const,
            data: {
              switchToMasterPassword: true,
              switchToPinCode: false,
            },
          },
          PinCodeRequested: {
            type: "final" as const,
            data: {
              switchToMasterPassword: false,
              switchToPinCode: true,
            },
          },
        },
        on: {
          USE_MASTER_PASSWORD: {
            actions: ["clearError"],
            target: ".MasterPasswordRequested",
            internal: true,
          },
          SWITCH_TO_PIN_CODE: {
            actions: ["clearError"],
            target: ".PinCodeRequested",
            internal: true,
          },
        },
      },
      options: {
        actions: {
          clearError: assign({
            error: () => undefined,
          }) as any,
          assignWebAuthnError: assign({
            error: (_, event: WebAuthnAuthenticationFailEvent) => event.error,
          }) as any,
        },
        services: {},
        guards: {},
      },
    };
  }
  public create() {
    const { config, options } = this.desc();
    return createMachine(config, options);
  }
}
