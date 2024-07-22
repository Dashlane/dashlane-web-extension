import { assign, createMachine } from "xstate";
import { Injectable } from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  CompleteKeyExchangeAndGeneratePassphraseDoneEvent,
  DeviceToDeviceAuthenticationError,
  DeviceToDeviceAuthenticationFlowEvents,
  RequestTransferDoneEvent,
  StartReceiverKeyExchangeDoneEvent,
  StartTransferDoneEvent,
} from ".";
import { RequestDeviceTransferService } from "./services/request-device-transfer.service";
import { StartReceiverKeyExchangeService } from "./services/start-receiver-key-exchange.service";
import { StartTransferService } from "./services/start-transfer.service";
import { OpenSessionService } from "./services/open-session.service";
import { AuthenticationMachineBaseContext } from "../main-flow/types";
import { CompleteKeyExchangeAndGeneratePassphraseService } from "./services/complete-key-exchange-and-generate-pasphrase.service";
export type DeviceToDeviceAuthenticationFlowContext =
  AuthenticationMachineBaseContext & {
    deviceName?: string;
    transferId?: string;
    receiverPublicKey?: string;
    receiverPrivateKey?: string;
    senderPublicKey?: string;
    sharedSecret?: string;
    encryptedData?: string;
    nonce?: string;
    passphrase?: string;
    error?: AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors;
  };
@Injectable()
export class DeviceToDeviceAuthenticationFlowMachine {
  public constructor(
    private requestDeviceTransfer: RequestDeviceTransferService,
    private startReceiverKeyExchange: StartReceiverKeyExchangeService,
    private completeKeyExchangeAndGeneratePassphrase: CompleteKeyExchangeAndGeneratePassphraseService,
    private startTransfer: StartTransferService,
    private openSession: OpenSessionService
  ) {}
  public desc() {
    return {
      config: {
        predictableActionArguments: true,
        schema: {
          events: {} as DeviceToDeviceAuthenticationFlowEvents,
          context: {} as DeviceToDeviceAuthenticationFlowContext,
        },
        id: "DeviceToDeviceAuthenticationFlow",
        initial: "WaitingForTransferRequest",
        context: {
          transferId: undefined,
        },
        states: {
          WaitingForTransferRequest: {
            invoke: {
              src: "requestDeviceTransfer",
              onDone: {
                target: "DisplayInstructions",
                actions: ["assignTransferId"],
              },
              onError: {
                actions: ["assignDeviceToDeviceError"],
                target: "DeviceTransferError",
              },
            },
          },
          DisplayInstructions: {
            invoke: {
              src: "startReceiverKeyExchange",
              onDone: {
                actions: ["assignKeys"],
                target: "GeneratePassphrase",
              },
              onError: {
                actions: ["assignDeviceToDeviceError"],
                target: "DeviceTransferError",
              },
            },
          },
          GeneratePassphrase: {
            invoke: {
              src: "completeKeyExchangeAndGeneratePassphrase",
              onDone: {
                actions: ["assignPassphrase"],
                target: "StartTransfer",
              },
              onError: {
                actions: ["assignDeviceToDeviceError"],
                target: "DeviceTransferError",
              },
            },
          },
          StartTransfer: {
            invoke: {
              src: "startTransfer",
              onDone: {
                actions: ["assignTransferData"],
                target: "OpenSession",
              },
              onError: {
                actions: ["assignDeviceToDeviceError"],
                target: "DeviceTransferError",
              },
            },
          },
          OpenSession: {
            invoke: {
              src: "openSession",
              onDone: {
                target: "DeviceRegistered",
              },
              onError: {
                actions: ["assignDeviceToDeviceError"],
                target: "DeviceTransferError",
              },
            },
          },
          DeviceTransferError: {},
          DeviceRegistered: {
            type: "final" as const,
          },
        },
      },
      options: {
        actions: {
          assignTransferId: assign({
            transferId: (_, event: RequestTransferDoneEvent) =>
              event.data.transferId,
          }) as any,
          assignKeys: assign({
            receiverPublicKey: (_, event: StartReceiverKeyExchangeDoneEvent) =>
              event.data.receiverPublicKey,
            receiverPrivateKey: (_, event: StartReceiverKeyExchangeDoneEvent) =>
              event.data.receiverPrivateKey,
            senderPublicKey: (_, event: StartReceiverKeyExchangeDoneEvent) =>
              event.data.senderPublicKey,
          }) as any,
          assignPassphrase: assign({
            passphrase: (
              _,
              event: CompleteKeyExchangeAndGeneratePassphraseDoneEvent
            ) => event.data.passphrase,
            sharedSecret: (
              _,
              event: CompleteKeyExchangeAndGeneratePassphraseDoneEvent
            ) => event.data.sharedSecret,
          }) as any,
          assignTransferData: assign({
            encryptedData: (_, event: StartTransferDoneEvent) =>
              event.data.encryptedData,
            nonce: (_, event: StartTransferDoneEvent) => event.data.nonce,
          }) as any,
          clearContext: assign({
            deviceName: () => undefined,
            transferId: () => undefined,
            receiverPublicKey: () => undefined,
            receiverPrivateKey: () => undefined,
            senderPublicKey: () => undefined,
            sharedSecret: () => undefined,
            passphrase: () => undefined,
          }) as any,
          assignDeviceToDeviceError: assign({
            error: (_, event: any) =>
              event.data instanceof DeviceToDeviceAuthenticationError
                ? event.data.code
                : AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors
                    .GENERIC_ERROR,
          }) as any,
        },
        services: {
          requestDeviceTransfer: (
            context: DeviceToDeviceAuthenticationFlowContext
          ) => this.requestDeviceTransfer.execute(context),
          startReceiverKeyExchange: (
            context: DeviceToDeviceAuthenticationFlowContext
          ) => this.startReceiverKeyExchange.execute(context),
          completeKeyExchangeAndGeneratePassphrase: (
            context: DeviceToDeviceAuthenticationFlowContext
          ) => this.completeKeyExchangeAndGeneratePassphrase.execute(context),
          startTransfer: (context: DeviceToDeviceAuthenticationFlowContext) =>
            this.startTransfer.execute(context),
          openSession: (context: DeviceToDeviceAuthenticationFlowContext) =>
            this.openSession.execute(context),
        },
      },
    };
  }
  public create() {
    const { config, options } = this.desc();
    return createMachine(config, options);
  }
}
