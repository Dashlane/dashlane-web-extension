import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { sharingRecipientsApi } from "./api";
export abstract class SharingRecipientsClient extends defineModuleClient(
  sharingRecipientsApi
) {}
registerModuleClient(sharingRecipientsApi, SharingRecipientsClient);
