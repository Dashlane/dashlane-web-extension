import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { pinCodeApi } from "./api";
export abstract class PinCodeClient extends defineModuleClient(pinCodeApi) {}
registerModuleClient(pinCodeApi, PinCodeClient);
