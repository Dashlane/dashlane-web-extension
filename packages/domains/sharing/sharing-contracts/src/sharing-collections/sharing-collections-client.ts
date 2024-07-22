import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { sharingCollectionsApi } from "./api";
export abstract class SharingCollectionsClient extends defineModuleClient(
  sharingCollectionsApi
) {}
registerModuleClient(sharingCollectionsApi, SharingCollectionsClient);
