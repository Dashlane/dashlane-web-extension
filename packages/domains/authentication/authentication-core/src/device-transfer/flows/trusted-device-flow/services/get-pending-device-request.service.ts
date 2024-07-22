import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { DeviceToDeviceAuthenticationService } from "../../../services/device-to-device-authentication.service";
import { GetPendingDeviceRequestResponse } from "../trusted-device-flow.types";
@Injectable()
export class GetPendingDeviceTransferRequestMachineService {
  public constructor(
    private d2dAuthenticationService: DeviceToDeviceAuthenticationService
  ) {}
  public async execute(): Promise<GetPendingDeviceRequestResponse> {
    const result =
      await this.d2dAuthenticationService.getKeyExchangeTransferInfo();
    if (isFailure(result)) {
      throw new Error("Error with getKeyExchangeTransferInfo");
    }
    const { transferId, receiver } = result.data.transfer;
    return Promise.resolve({
      transferId: transferId,
      requestTimestamp: receiver.requestedAtDateUnix,
      untrustedDeviceName: receiver.deviceName,
      untrustedDeviceLocation: `${receiver.city}, ${receiver.countryCode}`,
      untrustedDeviceHashedPublicKey: receiver.hashedPublicKey,
    });
  }
}
