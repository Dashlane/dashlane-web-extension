import { Injectable } from "@dashlane/framework-application";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { DeviceToDeviceAuthenticationService } from "../../../../device-transfer/services/device-to-device-authentication.service";
import { DeviceToDeviceCryptoService } from "../../../../device-transfer/services/device-to-device-crypto.service";
import { DeviceToDeviceAuthenticationFlowContext } from "../device-to-device-authentication-flow.machine";
import { DeviceToDeviceAuthenticationError } from "..";
@Injectable()
export class OpenSessionService {
  public constructor(
    private d2dCryptoService: DeviceToDeviceCryptoService,
    private d2dAuthenticationService: DeviceToDeviceAuthenticationService
  ) {}
  public async execute(context: DeviceToDeviceAuthenticationFlowContext) {
    if (!context.transferId || !context.login) {
      throw new DeviceToDeviceAuthenticationError(
        "No transferId or user login in the machine context",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    if (
      !context.receiverPrivateKey ||
      !context.receiverPublicKey ||
      !context.senderPublicKey
    ) {
      throw new DeviceToDeviceAuthenticationError(
        "Missing keys/data in context",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    if (!context.sharedSecret) {
      throw new DeviceToDeviceAuthenticationError(
        "Missing sharedSecret in context",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    if (!context.encryptedData || !context.nonce) {
      throw new DeviceToDeviceAuthenticationError(
        "Missing transfer data in context",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    const decryptionKey = this.d2dCryptoService.generateSymmetricKey(
      context.login,
      context.transferId,
      context.sharedSecret
    );
    const decryptedPayload =
      this.d2dCryptoService.decryptInvisibleMasterPassword(
        context.encryptedData,
        context.nonce,
        decryptionKey
      );
    await this.d2dAuthenticationService.openSession(
      decryptedPayload.login,
      decryptedPayload.token,
      decryptedPayload.key.value,
      context.deviceName
    );
  }
}
