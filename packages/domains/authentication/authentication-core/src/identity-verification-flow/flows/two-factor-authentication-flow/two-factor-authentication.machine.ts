import { assign, createMachine } from "xstate";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { Injectable } from "@dashlane/framework-application";
import { IdentityVerificationMachineBaseContext } from "../main-flow/types";
import {
  InputTotpEvent,
  SwitchTwoFactorAuthenticationTypeEvent,
  TwoFactorAuthenticationEvents,
} from "./two-factor-authentication.events";
import { TwoFactorAuthenticationService } from "./two-factor-authentication.service";
import { DefaultErrorCode, TotpErrorCode } from "../../types/errors";
export type TwoFactorAuthenticationContext =
  IdentityVerificationMachineBaseContext & {
    twoFactorAuthenticationOtpType: IdentityVerificationFlowContracts.IdentityVerificationFlowTwoFactorAuthenticationOtpType;
    masterPassword?: string;
    twoFactorAuthenticationOtpValue?: string;
    otpVerificationMode?: string;
    deviceName?: string;
    error?: string;
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
        id: "TwoFactorAuthenticationMachine",
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
            invoke: {
              src: "authenticateWithTwoFactorAuthentication",
              onDone: {
                target: "TwoFactorAuthenticationDone",
              },
              onError: [
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
            error: (
              _,
              event: {
                data: TotpErrorCode | DefaultErrorCode;
              }
            ) => event.data,
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
        },
        services: {
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
            return this.twoFactorAuthenticationService.executeWithParams(
              params
            );
          },
        },
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
