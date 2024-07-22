import { Injectable } from "@dashlane/framework-application";
import { device } from "@dashlane/browser-utils";
import { isFailure } from "@dashlane/framework-types";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { DeviceToDeviceAuthenticationService } from "../../../../device-transfer/services/device-to-device-authentication.service";
import { DeviceToDeviceAuthenticationFlowContext } from "../device-to-device-authentication-flow.machine";
import { DeviceToDeviceAuthenticationError } from "..";
@Injectable()
export class RequestDeviceTransferService {
  public constructor(
    private d2dAuthenticationService: DeviceToDeviceAuthenticationService
  ) {}
  public async execute({ login }: DeviceToDeviceAuthenticationFlowContext) {
    const deviceName = device.getDefaultDeviceName();
    if (!login || !deviceName) {
      throw new DeviceToDeviceAuthenticationError(
        "No user login/device name",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    const requestTransferResult =
      await this.d2dAuthenticationService.requestTransfer(login, deviceName);
    if (isFailure(requestTransferResult)) {
      throw new DeviceToDeviceAuthenticationError(
        "Request transfer error",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    const { transferId, expireDateUnix } = requestTransferResult.data;
    return Promise.resolve({
      transferId,
      expireDateUnix,
    });
  }
}
