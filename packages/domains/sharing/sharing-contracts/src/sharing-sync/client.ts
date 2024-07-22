import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { sharingSyncApi } from "./api";
export abstract class SharingSyncClient extends defineModuleClient(
  sharingSyncApi
) {}
registerModuleClient(sharingSyncApi, SharingSyncClient);
