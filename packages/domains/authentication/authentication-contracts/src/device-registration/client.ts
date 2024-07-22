import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { deviceRegistrationApi } from "./api";
export abstract class DeviceRegistrationClient extends defineModuleClient(
  deviceRegistrationApi
) {}
registerModuleClient(deviceRegistrationApi, DeviceRegistrationClient);
