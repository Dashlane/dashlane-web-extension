import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { TrustedDeviceFlowError, TrustedDeviceFlowMachineContext } from "..";
import { DeviceToDeviceAuthenticationService } from "../../../services/device-to-device-authentication.service";
import { DeviceToDeviceCryptoService } from "../../../services/device-to-device-crypto.service";
import { PassphraseService } from "../../../services/passphrase.service";
@Injectable()
export class VerifyPassphraseChallengeMachineService {
  public constructor(
    private passphraseService: PassphraseService,
    private d2dCryptoService: DeviceToDeviceCryptoService,
    private d2dAuthenticationService: DeviceToDeviceAuthenticationService
  ) {}
  public async execute(context: TrustedDeviceFlowMachineContext) {
    const isPassphraseCorrect = this.passphraseService.verifyChallenge(
      context.passphrase,
      context.passphraseGuess
    );
    if (!isPassphraseCorrect) {
      throw new TrustedDeviceFlowError(
        "Passphrase incorrect",
        context.passphraseAttemptsLeft > 1
          ? DeviceTransferContracts.TrustedDeviceFlowErrors.INVALID_PASSPHRASE
          : DeviceTransferContracts.TrustedDeviceFlowErrors
              .PASSPHRASE_ATTEMPTS_LIMIT
      );
    }
    const userLogin = await this.d2dAuthenticationService.getCurrentUserLogin();
    if (isFailure(userLogin) || !userLogin.data || !context.transferId) {
      throw new Error("No user login or no transferId");
    }
    const userInvisibleMasterPassword =
      await this.d2dAuthenticationService.getUserInvisibleMasterPassword();
    const authTicketResponse =
      await this.d2dAuthenticationService.requestAuthTicket();
    if (isFailure(authTicketResponse)) {
      throw new Error("Couldn't get authTicket");
    }
    const { encryptedData, nonce } =
      this.d2dCryptoService.encryptInvisibleMasterPassword(
        userLogin.data,
        authTicketResponse.data,
        userInvisibleMasterPassword,
        context.transferId,
        context.sharedSecret
      );
    const completeTransferResponse =
      await this.d2dAuthenticationService.completeTransfer(
        encryptedData,
        nonce,
        context.transferId
      );
    if (isFailure(completeTransferResponse)) {
      return Promise.reject(completeTransferResponse.error);
    }
    return Promise.resolve();
  }
}
