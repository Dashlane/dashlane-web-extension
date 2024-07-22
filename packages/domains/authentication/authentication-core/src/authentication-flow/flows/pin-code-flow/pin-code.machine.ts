import { assign, createMachine } from "xstate";
import { Injectable } from "@dashlane/framework-application";
import {
  AuthenticationGenericError,
  AuthenticationMachineBaseContext,
} from "../main-flow/types";
import { InputPinCodeEvent, PinCodeMachineEvents } from "./pin-code.events";
import {
  PinCodeVerificationService,
  WrongPinCodeError,
} from "./pin-code-verification.service";
export type PinCodeMachineContext = AuthenticationMachineBaseContext & {
  pinCode: string;
  error?: AuthenticationGenericError;
};
@Injectable()
export class PinCodeMachine {
  public constructor(
    private pinCodeVerificationService: PinCodeVerificationService
  ) {}
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as PinCodeMachineEvents,
          context: {} as PinCodeMachineContext,
        },
        id: "PinCodeMachine",
        context: {
          pinCode: "",
        },
        initial: "WaitingForPinCode",
        states: {
          WaitingForPinCode: {
            on: {
              INPUT_PIN_CODE: {
                target: "ValidatingPinCode",
                actions: ["assignPinCode"],
              },
              USE_MASTER_PASSWORD: {
                target: "#AuthenticationFlowMachine.MasterPassword",
              },
              USE_DEVICE_TO_DEVICE_AUTHENTICATION: {
                target:
                  "#AuthenticationFlowMachine.DeviceToDeviceAuthentication",
              },
            },
          },
          ValidatingPinCode: {
            invoke: {
              src: "validatePinCode",
              onDone: {
                target: "PinCodeDone",
              },
              onError: {
                actions: ["assignPinCodeError"],
                target: "WaitingForPinCode",
              },
            },
          },
          PinCodeDone: {
            type: "final" as const,
          },
        },
      },
      options: {
        actions: {
          assignPinCode: assign({
            pinCode: (_, event: InputPinCodeEvent) => event.pinCode,
          }) as any,
          assignPinCodeError: assign({
            error: (_, event: any) => {
              const code =
                event.data instanceof WrongPinCodeError
                  ? "wrong_pin_code"
                  : "unknown_error";
              return {
                code,
              };
            },
          }) as any,
          clearError: assign({
            error: () => undefined,
          }) as any,
          clearContext: assign({
            pinCode: () => "",
            error: () => undefined,
          }) as any,
        },
        services: {
          validatePinCode: (context: PinCodeMachineContext) =>
            this.pinCodeVerificationService.executeWithParams({
              loginEmail: context.login,
              pinCode: context.pinCode,
            }),
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
