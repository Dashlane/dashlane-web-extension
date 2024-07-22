import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { deviceTransferApi } from "./api";
export abstract class DeviceTransferClient extends defineModuleClient(
  deviceTransferApi
) {}
registerModuleClient(deviceTransferApi, DeviceTransferClient);
