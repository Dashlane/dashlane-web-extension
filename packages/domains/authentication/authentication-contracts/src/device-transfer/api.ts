import { defineModuleApi } from "@dashlane/framework-contracts";
import { TrustedDeviceFlowStatusQuery } from "./queries";
import {
  ApproveDeviceTransferRequestCommand,
  CancelRequestCommand,
  RefreshRequestCommand,
  RejectDeviceTransferRequestCommand,
  ReturnToDeviceSetupCommand,
  SubmitPassphraseChallengeCommand,
} from "./commands";
export const deviceTransferApi = defineModuleApi({
  name: "deviceTransfer" as const,
  commands: {
    refreshRequest: RefreshRequestCommand,
    cancelRequest: CancelRequestCommand,
    approveRequest: ApproveDeviceTransferRequestCommand,
    rejectRequest: RejectDeviceTransferRequestCommand,
    submitPassphraseChallenge: SubmitPassphraseChallengeCommand,
    returnToDeviceSetupCommand: ReturnToDeviceSetupCommand,
  },
  events: {},
  queries: {
    trustedDeviceFlowStatus: TrustedDeviceFlowStatusQuery,
  },
});
export type DeviceTransferApi = typeof deviceTransferApi;
