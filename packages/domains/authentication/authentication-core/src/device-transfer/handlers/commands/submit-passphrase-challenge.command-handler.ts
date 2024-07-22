import {
  CommandHandler,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { TrustedDeviceFlow } from "../../services/trusted-device-flow.instance.service";
import { Result, success } from "@dashlane/framework-types";
@CommandHandler(DeviceTransferContracts.SubmitPassphraseChallengeCommand)
export class SubmitPassphraseChallengeCommandHandler
  implements
    ICommandHandler<DeviceTransferContracts.SubmitPassphraseChallengeCommand>
{
  constructor(private trustedDeviceFlow: TrustedDeviceFlow) {
    this.trustedDeviceFlow = trustedDeviceFlow;
  }
  public execute(
    request: DeviceTransferContracts.SubmitPassphraseChallengeCommand
  ): Promise<Result<undefined>> {
    const { passphraseChallenge } = request.body;
    this.trustedDeviceFlow.continue({
      type: "SUBMIT_PASSPHRASE_CHALLENGE",
      passphraseChallenge,
    });
    return Promise.resolve(success(undefined));
  }
}
