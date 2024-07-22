import { assign, createMachine } from "xstate";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { Injectable } from "@dashlane/framework-application";
import {
  ApproveDeviceRequestDoneEvent,
  GetPendingDeviceTransferRequestDoneEvent,
  PASSPHRASE_MAX_ATTEMPTS,
  SubmitPassphraseChallengeEvent,
  TrustedDeviceFlowError,
  TrustedDeviceFlowMachineContext,
  TrustedDeviceFlowMachineEvents,
} from ".";
import { GetPendingDeviceTransferRequestMachineService } from "./services/get-pending-device-request.service";
import { ApproveDeviceTransferRequestMachineService } from "./services/approve-device-transfer-request.service";
import { VerifyPassphraseChallengeMachineService } from "./services/verify-passphrase-challenge.service";
@Injectable()
export class TrustedDeviceFlowMachine {
  public constructor(
    private getPendingDeviceTransferRequestService: GetPendingDeviceTransferRequestMachineService,
    private approveDeviceTransferRequestService: ApproveDeviceTransferRequestMachineService,
    private verifyPassphraseChallengeService: VerifyPassphraseChallengeMachineService
  ) {}
  public create() {
    return createMachine(
      {
        predictableActionArguments: true,
        schema: {
          events: {} as TrustedDeviceFlowMachineEvents,
          context: {} as TrustedDeviceFlowMachineContext,
        },
        initial: "WaitingForNewDeviceTransferRequest",
        id: "TrustedDeviceFlowMachine",
        context: {
          transferId: undefined,
          untrustedDeviceName: "",
          untrustedDeviceHashedPublicKey: "",
          untrustedDeviceLocation: "",
          sharedSecret: "",
          passphrase: "",
          passphraseGuess: "",
          passphraseMissingWordIndex: -1,
          passphraseAttemptsLeft: PASSPHRASE_MAX_ATTEMPTS,
        },
        states: {
          Idle: {
            on: {
              REFRESH_REQUEST: {
                target: "WaitingForNewDeviceTransferRequest",
              },
            },
          },
          WaitingForNewDeviceTransferRequest: {
            invoke: {
              src: "getPendingDeviceTransferRequest",
              onDone: [
                {
                  actions: ["assignUntrustedDeviceData"],
                  cond: "isDeviceTransferRequestAvailable",
                  target: "NewDeviceTransferRequest",
                },
                {
                  target: "Idle",
                },
              ],
              onError: {
                actions: ["assignTrustedDeviceFlowError"],
                target: "Idle",
              },
            },
          },
          NewDeviceTransferRequest: {
            on: {
              APPROVE_REQUEST: {
                target: "HandlingDeviceTransferRequest",
              },
              REJECT_REQUEST: {
                actions: ["clearContext"],
                target: "DeviceTransferRejected",
              },
              RETURN_TO_DEVICE_SETUP: {
                actions: ["clearContext"],
                target: "Idle",
              },
            },
          },
          HandlingDeviceTransferRequest: {
            invoke: {
              src: "approveDeviceTransferRequest",
              onDone: {
                actions: ["assignPassphraseChallengeData"],
                target: "DisplayPassphraseChallenge",
              },
              onError: {
                actions: ["assignTrustedDeviceFlowError"],
                target: "DeviceTransferFailed",
              },
            },
          },
          DisplayPassphraseChallenge: {
            on: {
              SUBMIT_PASSPHRASE_CHALLENGE: {
                actions: ["assignPassphraseGuess", "clearError"],
                target: "VerifyingPassphraseChallenge",
              },
              CANCEL_REQUEST: {
                actions: ["clearContext"],
                target: "Idle",
              },
            },
          },
          VerifyingPassphraseChallenge: {
            invoke: {
              src: "verifyPassphraseChallenge",
              onDone: {
                target: "DeviceTransferComplete",
              },
              onError: [
                {
                  actions: [
                    "assignTrustedDeviceFlowError",
                    "updatePassphraseAttempts",
                  ],
                  target: "DisplayPassphraseChallenge",
                  cond: "isInvalidPassphraseError",
                },
                {
                  actions: [
                    "assignTrustedDeviceFlowError",
                    "updatePassphraseAttempts",
                  ],
                  target: "DeviceTransferFailed",
                },
              ],
            },
          },
          DeviceTransferComplete: {
            on: {
              RETURN_TO_DEVICE_SETUP: {
                actions: ["clearContext"],
                target: "Idle",
              },
            },
          },
          DeviceTransferRejected: {
            on: {
              RETURN_TO_DEVICE_SETUP: {
                target: "Idle",
              },
            },
          },
          DeviceTransferFailed: {
            on: {
              RETURN_TO_DEVICE_SETUP: {
                actions: ["clearContext"],
                target: "Idle",
              },
            },
          },
        },
      },
      {
        actions: {
          assignUntrustedDeviceData: assign({
            transferId: (_, event: GetPendingDeviceTransferRequestDoneEvent) =>
              event.data.transferId,
            untrustedDeviceName: (
              _,
              event: GetPendingDeviceTransferRequestDoneEvent
            ) => event.data.untrustedDeviceName,
            untrustedDeviceHashedPublicKey: (
              _,
              event: GetPendingDeviceTransferRequestDoneEvent
            ) => event.data.untrustedDeviceHashedPublicKey,
            untrustedDeviceLocation: (
              _,
              event: GetPendingDeviceTransferRequestDoneEvent
            ) => event.data.untrustedDeviceLocation,
            requestTimestamp: (
              _,
              event: GetPendingDeviceTransferRequestDoneEvent
            ) => event.data.requestTimestamp,
          }) as any,
          clearContext: assign({
            transferId: () => undefined,
            untrustedDeviceName: () => "",
            untrustedDeviceHashedPublicKey: () => "",
            untrustedDeviceLocation: () => "",
            sharedSecret: () => "",
            passphrase: () => "",
            passphraseGuess: () => "",
            passphraseMissingWordIndex: () => -1,
            passphraseAttemptsLeft: () => PASSPHRASE_MAX_ATTEMPTS,
            error: () => undefined,
          }) as any,
          clearError: assign({
            error: () => undefined,
          }) as any,
          assignTrustedDeviceFlowError: assign({
            error: (_, event: any) =>
              event.data instanceof TrustedDeviceFlowError
                ? event.data.code
                : DeviceTransferContracts.TrustedDeviceFlowErrors.GENERIC_ERROR,
          }) as any,
          assignPassphraseChallengeData: assign({
            sharedSecret: (_, event: ApproveDeviceRequestDoneEvent) =>
              event.data.sharedSecret,
            passphrase: (_, event: ApproveDeviceRequestDoneEvent) =>
              event.data.passphrase,
            passphraseMissingWordIndex: (
              _,
              event: ApproveDeviceRequestDoneEvent
            ) => event.data.passhraseMissingWordIndex,
          }) as any,
          assignPassphraseGuess: assign({
            passphraseGuess: (_, event: SubmitPassphraseChallengeEvent) =>
              event.passphraseChallenge,
          }) as any,
          updatePassphraseAttempts: assign({
            passphraseAttemptsLeft: (context, event: any) =>
              event.data instanceof TrustedDeviceFlowError &&
              event.data.code ===
                DeviceTransferContracts.TrustedDeviceFlowErrors
                  .INVALID_PASSPHRASE
                ? context.passphraseAttemptsLeft - 1
                : context.passphraseAttemptsLeft,
          }),
        },
        services: {
          getPendingDeviceTransferRequest: () =>
            this.getPendingDeviceTransferRequestService.execute(),
          approveDeviceTransferRequest: (context) =>
            this.approveDeviceTransferRequestService.execute(context),
          verifyPassphraseChallenge: (context) =>
            this.verifyPassphraseChallengeService.execute(context),
        },
        guards: {
          isDeviceTransferRequestAvailable: (_, event) =>
            !!(event as GetPendingDeviceTransferRequestDoneEvent).data
              .transferId,
          isInvalidPassphraseError: (_, event: any) =>
            event.data instanceof TrustedDeviceFlowError &&
            event.data.code === "INVALID_PASSPHRASE",
        },
      }
    );
  }
}
