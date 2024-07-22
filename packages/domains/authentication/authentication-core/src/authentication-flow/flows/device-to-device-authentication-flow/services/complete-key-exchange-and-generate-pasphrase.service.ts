import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { DeviceToDeviceAuthenticationFlowContext } from "../device-to-device-authentication-flow.machine";
import { PassphraseService } from "../../../../device-transfer/services/passphrase.service";
import { DeviceToDeviceCryptoService } from "../../../../device-transfer/services/device-to-device-crypto.service";
import { DeviceToDeviceAuthenticationService } from "../../../../device-transfer/services/device-to-device-authentication.service";
import {
  CompleteKeyExchangeAndGeneratePassphraseResponseData,
  DeviceToDeviceAuthenticationError,
} from "..";
@Injectable()
export class CompleteKeyExchangeAndGeneratePassphraseService {
  public constructor(
    private d2dCryptoService: DeviceToDeviceCryptoService,
    private d2dAuthenticationService: DeviceToDeviceAuthenticationService,
    private passphraseService: PassphraseService
  ) {}
  public async execute(
    context: DeviceToDeviceAuthenticationFlowContext
  ): Promise<
    | CompleteKeyExchangeAndGeneratePassphraseResponseData
    | DeviceToDeviceAuthenticationError
  > {
    if (
      !context.receiverPrivateKey ||
      !context.receiverPublicKey ||
      !context.senderPublicKey
    ) {
      throw new DeviceToDeviceAuthenticationError(
        "Keys not found in the state machine context",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    if (!context.transferId) {
      throw new DeviceToDeviceAuthenticationError(
        "TransferId not found in the state machine context/store",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    if (!context.login) {
      throw new DeviceToDeviceAuthenticationError(
        "User login not found in state machine context/store",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    const completeKeyExchangeResponse =
      await this.d2dAuthenticationService.completeKeyExchange(
        context.transferId,
        context.receiverPublicKey
      );
    if (isFailure(completeKeyExchangeResponse)) {
      throw new DeviceToDeviceAuthenticationError(
        "Error with completeKeyExchange",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    const sharedSecret = this.d2dCryptoService.generateReceiverSharedSecret(
      context.receiverPublicKey,
      context.receiverPrivateKey,
      context.senderPublicKey
    );
    const visualCheckSeed = this.d2dCryptoService.generateVisualCheckSeed(
      context.login,
      context.transferId,
      sharedSecret
    );
    const { passphrase } =
      await this.passphraseService.generatePassphraseChallenge(visualCheckSeed);
    return Promise.resolve({
      sharedSecret,
      passphrase,
    });
  }
}
