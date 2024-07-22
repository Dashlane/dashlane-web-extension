import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { sharingItemsApi } from "./api";
export abstract class SharingItemsClient extends defineModuleClient(
  sharingItemsApi
) {}
registerModuleClient(sharingItemsApi, SharingItemsClient);
