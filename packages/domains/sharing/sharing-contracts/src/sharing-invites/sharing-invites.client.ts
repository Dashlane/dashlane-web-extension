import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { sharingInvitesApi } from ".";
export abstract class SharingInvitesClient extends defineModuleClient(
  sharingInvitesApi
) {}
registerModuleClient(sharingInvitesApi, SharingInvitesClient);
