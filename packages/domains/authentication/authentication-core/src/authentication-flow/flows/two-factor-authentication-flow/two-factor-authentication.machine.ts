import { assign, createMachine } from "xstate";
import { Injectable } from "@dashlane/framework-application";
import {
  AuthenticationGenericError,
  AuthenticationMachineBaseContext,
} from "../main-flow/types";
import {
  InputTotpEvent,
  LegacyErrorEvent,
  SwitchTwoFactorAuthenticationTypeEvent,
  TwoFactorAuthenticationEvents,
} from "./two-factor-authentication.events";
import { TwoFactorAuthenticationService } from "./two-factor-authentication.service";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
type TwoFactorAuthenticationError = AuthenticationGenericError;
export type TwoFactorAuthenticationContext =
  AuthenticationMachineBaseContext & {
    twoFactorAuthenticationOtpType: AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpType;
    masterPassword?: string;
    twoFactorAuthenticationOtpValue?: string;
    otpVerificationMode?: string;
    deviceName?: string;
    error?: TwoFactorAuthenticationError;
  };
@Injectable()
export class TwoFactorAuthenticationMachine {
  private twoFactorAuthenticationService: TwoFactorAuthenticationService;
  public constructor(
    twoFactorAuthenticationService: TwoFactorAuthenticationService
  ) {
    this.twoFactorAuthenticationService = twoFactorAuthenticationService;
  }
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as TwoFactorAuthenticationEvents,
          context: {} as TwoFactorAuthenticationContext,
        },
        id: "WebAuthnMachine",
        context: {
          twoFactorAuthenticationOtpType: "totp" as const,
        },
        initial: "WaitingForTotp",
        states: {
          WaitingForTotp: {
            on: {
              INPUT_TOTP: {
                target: "ValidatingTwoFactorAuthenticationOtp",
                actions: ["assignTwoFactorAuthenticationOtpValue"],
              },
              SWITCH_TWO_FACTOR_AUTHENTICATION_TYPE: {
                target: "WaitingForBackupCode",
                actions: ["assignTwoFactorAuthenticationOtpType", "clearError"],
              },
            },
          },
          WaitingForBackupCode: {
            on: {
              INPUT_BACKUP_CODE: {
                target: "ValidatingTwoFactorAuthenticationOtp",
                actions: ["assignTwoFactorAuthenticationOtpValue"],
              },
              SWITCH_TWO_FACTOR_AUTHENTICATION_TYPE: {
                target: "WaitingForTotp",
                actions: ["assignTwoFactorAuthenticationOtpType", "clearError"],
              },
            },
          },
          ValidatingTwoFactorAuthenticationOtp: {
            entry: ["authenticateWithTwoFactorAuthentication"],
            on: {
              CARBON_LEGACY_ERROR: [
                {
                  target: "WaitingForBackupCode",
                  cond: "isBackupCode",
                  actions: ["assignError"],
                },
                {
                  target: "WaitingForTotp",
                  actions: ["assignError"],
                },
              ],
            },
          },
          TwoFactorAuthenticationDone: {
            type: "final" as const,
          },
        },
      },
      options: {
        actions: {
          assignError: assign({
            error: (_, event: LegacyErrorEvent) => ({
              code: "unknown_error",
              data: {
                message: event.error,
              },
            }),
          }) as any,
          clearError: assign({
            error: () => undefined,
          }) as any,
          assignTwoFactorAuthenticationOtpValue: assign({
            twoFactorAuthenticationOtpValue: (_, event: InputTotpEvent) =>
              event.twoFactorAuthenticationOtpValue,
          }) as any,
          assignTwoFactorAuthenticationOtpType: assign({
            twoFactorAuthenticationOtpType: (
              _,
              event: SwitchTwoFactorAuthenticationTypeEvent
            ) => event.twoFactorAuthenticationOtpType,
          }) as any,
          authenticateWithTwoFactorAuthentication: (
            context: TwoFactorAuthenticationContext
          ) => {
            const params = {
              login: context.login ?? "",
              masterPassword: context.masterPassword ?? null,
              otp: context.twoFactorAuthenticationOtpValue,
              twoFactorAuthenticationOtpType:
                context.twoFactorAuthenticationOtpType,
              persistData: true,
              otpVerificationMode: context.otpVerificationMode,
              deviceName: context.deviceName,
            };
            this.twoFactorAuthenticationService.executeWithParams(params);
          },
        },
        services: {},
        guards: {
          isBackupCode: (context: TwoFactorAuthenticationContext) => {
            return context.twoFactorAuthenticationOtpType === "backupCode";
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
