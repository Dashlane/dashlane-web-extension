import { assign, createMachine } from "xstate";
import { Injectable } from "@dashlane/framework-application";
import {
  AuthenticationGenericError,
  AuthenticationMachineBaseContext,
} from "../main-flow/types";
import {
  CarbonLegacyErrorEvent,
  InitializationAccountRecoveryStatusEvent,
  InputMasterPasswordEvent,
  LoginStatusUpdateEvent,
  MasterPasswordFlowEvents,
  MpVerificationError,
} from "./master-password.events";
import { MasterPasswordService } from "./services/master-password.service";
import { AccountRecoveryStatusService } from "./services/account-recovery-status.service";
import { CheckIsMigrationNeededService } from "./services/check-is-migration-needed.service";
import { MasterPasswordVerificationService } from "./services/master-password-verification.service";
import { AuthenticationMachineContext } from "../main-flow/authentication.machine";
type MasterPasswordError = AuthenticationGenericError;
export type MasterPasswordFlowContext = AuthenticationMachineBaseContext & {
  isAccountRecoveryAvailable: boolean;
  isRememberMeEnabled: boolean;
  serviceProviderRedirectUrl?: string;
  isNitroProvider?: boolean;
  masterPassword?: string;
  error?: MasterPasswordError;
};
@Injectable()
export class MasterPasswordFlowMachine {
  public constructor(
    private accountRecoveryStatusService: AccountRecoveryStatusService,
    private masterPasswordService: MasterPasswordService,
    private checkIsMigrationNeededService: CheckIsMigrationNeededService,
    private mpVerificationService: MasterPasswordVerificationService
  ) {}
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as MasterPasswordFlowEvents,
          context: {} as MasterPasswordFlowContext,
        },
        initial: "CheckingAccountRecoveryStatus",
        id: "MasterPasswordFlowMachine",
        context: {
          isRememberMeEnabled: false,
          isAccountRecoveryAvailable: false,
        },
        states: {
          CheckingAccountRecoveryStatus: {
            invoke: {
              src: "checkAccountRecoveryStatus",
              onDone: {
                target: "WaitingForMasterPassword",
                actions: ["assignAccountRecoveryStatus"],
              },
            },
          },
          WaitingForMasterPassword: {
            on: {
              INPUT_MASTER_PASSWORD: {
                target: "ValidatingMasterPassword",
                actions: ["assignMasterPassword"],
              },
              SWITCH_TO_PIN_CODE: {
                target: "#AuthenticationFlowMachine.PinCode",
                cond: "hasPinCodeEnabled",
              },
              CARBON_WRONG_PASSWORD: {
                actions: ["assignMpError"],
              },
            },
          },
          ValidatingMasterPassword: {
            invoke: {
              src: "validateMasterPassword",
              onDone: {
                target: "OpeningSessionWithMasterpassword",
              },
              onError: {
                actions: ["assignMaybeMpError"],
                target: "WaitingForMasterPassword",
              },
            },
            on: {
              CARBON_LEGACY_ERROR: {
                target: "WaitingForMasterPassword",
                actions: ["assignError"],
              },
              CARBON_WRONG_PASSWORD: {
                actions: ["assignMpError"],
                target: "WaitingForMasterPassword",
              },
            },
          },
          OpeningSessionWithMasterpassword: {
            invoke: {
              src: "authenticateWithMasterPassword",
              onError: {
                actions: ["assignMaybeMpError"],
                target: "WaitingForMasterPassword",
              },
              onDone: {
                target: "CheckingMigrationNeeded",
              },
              CARBON_WRONG_PASSWORD: {
                actions: ["assignMpError"],
                target: "WaitingForMasterPassword",
              },
            },
            on: {
              CARBON_LEGACY_ERROR: {
                target: "WaitingForMasterPassword",
                actions: ["assignError"],
              },
              DEVICE_LIMIT_ABORTED: {
                target: "DeviceLimitAborted",
              },
            },
          },
          CheckingMigrationNeeded: {
            invoke: {
              src: "checkIsMigrationNeeded",
              onDone: {
                target: "MasterPasswordDone",
                actions: ["assignSSOMigrationStatus"],
              },
              onError: {
                target: "WaitingForMasterPassword",
                actions: ["assignGenericServiceError"],
              },
            },
            on: {
              CARBON_LEGACY_ERROR: {
                target: "WaitingForMasterPassword",
                actions: ["assignError"],
              },
            },
          },
          DeviceLimitAborted: {
            type: "final" as const,
            data: {
              shouldResetAuthenticationFlow: true,
            },
          },
          MasterPasswordDone: {
            type: "final" as const,
            data: {
              shouldResetAuthenticationFlow: false,
            },
          },
        },
      },
      options: {
        actions: {
          assignMasterPassword: assign({
            masterPassword: (_, event: MasterPasswordFlowEvents) =>
              (event as InputMasterPasswordEvent).masterPassword,
            isRememberMeEnabled: (_, event: MasterPasswordFlowEvents) =>
              (event as InputMasterPasswordEvent).rememberMe,
          }) as any,
          assignAccountRecoveryStatus: assign({
            isAccountRecoveryAvailable: (_, event: MasterPasswordFlowEvents) =>
              (event as InitializationAccountRecoveryStatusEvent).data
                .isAccountRecoveryAvailable,
          }) as any,
          assignError: assign({
            error: (_, event: MasterPasswordFlowEvents) => ({
              code: "unknown_error",
              data: {
                message: (event as CarbonLegacyErrorEvent).error,
              },
            }),
          }) as any,
          assignGenericServiceError: assign({
            error: () => ({
              code: "unknown_error",
              data: {
                message: "UNKNOWN_ERROR",
              },
            }),
          }) as any,
          assignMpError: assign({
            error: () => ({
              code: "unknown_error",
              data: {
                message: "WRONG_PASSWORD",
              },
            }),
          }) as any,
          assignMaybeMpError: assign({
            error: (
              _,
              event: {
                data: Error;
              }
            ) => ({
              code: "unknown_error",
              data: {
                message:
                  event.data instanceof MpVerificationError
                    ? "WRONG_PASSWORD"
                    : "UNKNOWN_ERROR",
              },
            }),
          }) as any,
          assignSSOMigrationStatus: assign({
            serviceProviderRedirectUrl: (_, event: MasterPasswordFlowEvents) =>
              (event as LoginStatusUpdateEvent).data
                ?.serviceProviderRedirectUrl,
            isNitroProvider: (_, event: MasterPasswordFlowEvents) =>
              (event as LoginStatusUpdateEvent).data?.isNitroProvider,
          }) as any,
        },
        services: {
          authenticateWithMasterPassword: (
            context: MasterPasswordFlowContext
          ) => {
            const { login, masterPassword, isRememberMeEnabled, serverKey } =
              context;
            return this.masterPasswordService.executeWithParams({
              login: login ?? "",
              masterPassword: masterPassword ?? "",
              isRememberMeEnabled,
              serverKey,
            });
          },
          checkAccountRecoveryStatus: () =>
            this.accountRecoveryStatusService.execute(),
          checkIsMigrationNeeded: (context: MasterPasswordFlowContext) =>
            this.checkIsMigrationNeededService.executeWithParams({
              login: context.login ?? "",
            }),
          validateMasterPassword: ({
            login,
            masterPassword,
            serverKey,
          }: MasterPasswordFlowContext) =>
            this.mpVerificationService.executeWithParams({
              login: login ?? "",
              masterPassword: masterPassword ?? "",
              serverKey,
            }),
        },
        guards: {
          hasPinCodeEnabled: (context: MasterPasswordFlowContext) =>
            (context as AuthenticationMachineContext).shouldAskPinCode,
        },
      },
    };
  }
  public create() {
    const { config, options } = this.desc();
    return createMachine(config, options);
  }
}
