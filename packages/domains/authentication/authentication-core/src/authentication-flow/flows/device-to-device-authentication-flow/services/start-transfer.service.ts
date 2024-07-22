import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { DeviceToDeviceAuthenticationService } from "../../../../device-transfer/services/device-to-device-authentication.service";
import { DeviceToDeviceAuthenticationFlowContext } from "../device-to-device-authentication-flow.machine";
import {
  DeviceToDeviceAuthenticationError,
  StartTransferResponseData,
} from "..";
@Injectable()
export class StartTransferService {
  public constructor(
    private d2dAuthenticationService: DeviceToDeviceAuthenticationService
  ) {}
  public async execute(
    context: DeviceToDeviceAuthenticationFlowContext
  ): Promise<StartTransferResponseData> {
    if (!context.transferId || !context.login) {
      throw new DeviceToDeviceAuthenticationError(
        "No transferId or user login in the machine context",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.GENERIC_ERROR
      );
    }
    const startTransferResult =
      await this.d2dAuthenticationService.startTransfer(context.transferId);
    if (isFailure(startTransferResult)) {
      return Promise.reject(startTransferResult.error);
    }
    return Promise.resolve(startTransferResult.data);
  }
}
