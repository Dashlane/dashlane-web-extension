import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { DeviceToDeviceAuthenticationFlowContext } from "../device-to-device-authentication-flow.machine";
import { DeviceToDeviceCryptoService } from "../../../../device-transfer/services/device-to-device-crypto.service";
import { DeviceToDeviceAuthenticationService } from "../../../../device-transfer/services/device-to-device-authentication.service";
import { DeviceToDeviceAuthenticationError } from "..";
@Injectable()
export class StartReceiverKeyExchangeService {
  public constructor(
    private d2dCryptoService: DeviceToDeviceCryptoService,
    private d2dAuthenticationService: DeviceToDeviceAuthenticationService
  ) {}
  public async execute({
    transferId,
  }: DeviceToDeviceAuthenticationFlowContext) {
    if (!transferId) {
      throw new DeviceToDeviceAuthenticationError(
        "No transferId in context",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    const { privateKey: receiverPrivateKey, publicKey: receiverPublicKey } =
      this.d2dCryptoService.generateKeyPair();
    const receiverHashedPublicKey =
      this.d2dCryptoService.hash(receiverPublicKey);
    const startReceiverKeyExchangeResponse =
      await this.d2dAuthenticationService.startReceiverKeyExchange(
        transferId,
        receiverHashedPublicKey
      );
    if (isFailure(startReceiverKeyExchangeResponse)) {
      return Promise.reject(startReceiverKeyExchangeResponse.error);
    }
    const { senderPublicKey } = startReceiverKeyExchangeResponse.data;
    return Promise.resolve({
      receiverPrivateKey,
      receiverPublicKey,
      senderPublicKey,
    });
  }
}
