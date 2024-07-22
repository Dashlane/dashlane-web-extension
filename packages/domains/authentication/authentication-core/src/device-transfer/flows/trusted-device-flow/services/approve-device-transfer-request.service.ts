import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { DeviceToDeviceCryptoService } from "../../../services/device-to-device-crypto.service";
import { DeviceToDeviceAuthenticationService } from "../../../services/device-to-device-authentication.service";
import {
  ApproveDeviceRequestResponse,
  TrustedDeviceFlowMachineContext,
} from "../trusted-device-flow.types";
import { PassphraseService } from "../../../services/passphrase.service";
@Injectable()
export class ApproveDeviceTransferRequestMachineService {
  public constructor(
    private d2dCryptoService: DeviceToDeviceCryptoService,
    private d2dAuthenticationService: DeviceToDeviceAuthenticationService,
    private passphraseService: PassphraseService
  ) {}
  public async execute(
    context: TrustedDeviceFlowMachineContext
  ): Promise<ApproveDeviceRequestResponse> {
    const { privateKey, publicKey } = this.d2dCryptoService.generateKeyPair();
    if (!context.transferId) {
      throw new Error("No transferId in context");
    }
    const startSenderKeyExchangeResult =
      await this.d2dAuthenticationService.startSenderKeyExchange(
        context.transferId,
        publicKey
      );
    if (isFailure(startSenderKeyExchangeResult)) {
      return Promise.reject(startSenderKeyExchangeResult.error);
    }
    const { receiverPublicKey } = startSenderKeyExchangeResult.data;
    const receiverHashedPublicKey = context.untrustedDeviceHashedPublicKey;
    const isValidKey = this.d2dCryptoService.verifyUntrustedDevicePublicKey(
      receiverHashedPublicKey,
      receiverPublicKey
    );
    if (!isValidKey) {
      throw new Error("Receiver public key doesn't match");
    }
    const sharedSecret = this.d2dCryptoService.generateSenderSharedSecret(
      publicKey,
      privateKey,
      receiverPublicKey
    );
    const userLogin = await this.d2dAuthenticationService.getCurrentUserLogin();
    if (isFailure(userLogin) || !userLogin.data) {
      throw new Error("No user login in context");
    }
    const visualCheckSeed = this.d2dCryptoService.generateVisualCheckSeed(
      userLogin.data,
      context.transferId,
      sharedSecret
    );
    const { passphrase, missingWordIndex: passhraseMissingWordIndex } =
      await this.passphraseService.generatePassphraseChallenge(visualCheckSeed);
    return {
      sharedSecret,
      passphrase,
      passhraseMissingWordIndex,
    };
  }
}
