import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import {
  deviceScopedSingletonProvider,
  Module,
} from "@dashlane/framework-application";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
import {
  CryptographyToolbox,
  getCryptographyToolboxProvider,
} from "./crypto-utils/cryptography-toolbox.service";
import { TrustedDeviceFlowMachineStore } from "./stores/trusted-device-flow-machine.store";
import { TrustedDeviceFlow } from "./services/trusted-device-flow.instance.service";
import { DeviceToDeviceCryptoService } from "./services/device-to-device-crypto.service";
import { DeviceToDeviceAuthenticationService } from "./services/device-to-device-authentication.service";
import {
  PassphraseService,
  WordlistFetcher,
} from "./services/passphrase.service";
import { TrustedDeviceFlowMachine } from "./flows/trusted-device-flow";
import { GetPendingDeviceTransferRequestMachineService } from "./flows/trusted-device-flow/services/get-pending-device-request.service";
import { ApproveDeviceTransferRequestMachineService } from "./flows/trusted-device-flow/services/approve-device-transfer-request.service";
import { VerifyPassphraseChallengeMachineService } from "./flows/trusted-device-flow/services/verify-passphrase-challenge.service";
import { TrustedDeviceFlowStatusQueryHandler } from "./handlers/queries";
import {
  ApproveDeviceTransferRequestCommandHandler,
  CancelDeviceTransferRequestCommandHandler,
  RefreshRequestCommandHandler,
  RejectDeviceTransferRequestCommandHandler,
  ReturnToDeviceSetupCommandHandler,
  SubmitPassphraseChallengeCommandHandler,
} from "./handlers/commands";
@Module({
  api: DeviceTransferContracts.deviceTransferApi,
  stores: [TrustedDeviceFlowMachineStore],
  imports: [WebServicesModule],
  exports: [DeviceToDeviceCryptoService, CryptographyToolbox],
  providers: [
    getCryptographyToolboxProvider(),
    ...deviceScopedSingletonProvider(TrustedDeviceFlow, {
      inject: [TrustedDeviceFlowMachine, TrustedDeviceFlowMachineStore],
      asyncFactory: async (
        machine: TrustedDeviceFlowMachine,
        store: TrustedDeviceFlowMachineStore
      ) => {
        const flow = new TrustedDeviceFlow(machine, store);
        await flow.prepare();
        return flow;
      },
    }),
    CryptographyToolbox,
    PassphraseService,
    DeviceToDeviceCryptoService,
    DeviceToDeviceAuthenticationService,
    GetPendingDeviceTransferRequestMachineService,
    ApproveDeviceTransferRequestMachineService,
    VerifyPassphraseChallengeMachineService,
    TrustedDeviceFlowMachine,
    WordlistFetcher,
  ],
  handlers: {
    commands: {
      approveRequest: ApproveDeviceTransferRequestCommandHandler,
      refreshRequest: RefreshRequestCommandHandler,
      rejectRequest: RejectDeviceTransferRequestCommandHandler,
      cancelRequest: CancelDeviceTransferRequestCommandHandler,
      submitPassphraseChallenge: SubmitPassphraseChallengeCommandHandler,
      returnToDeviceSetup: ReturnToDeviceSetupCommandHandler,
    },
    events: {},
    queries: {
      trustedDeviceFlowStatus: TrustedDeviceFlowStatusQueryHandler,
    },
  },
})
export class DeviceTransferModule {}
