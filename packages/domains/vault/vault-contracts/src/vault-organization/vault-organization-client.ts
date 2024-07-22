import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { vaultOrganizationApi } from "./api";
export abstract class VaultOrganizationClient extends defineModuleClient(
  vaultOrganizationApi
) {}
registerModuleClient(vaultOrganizationApi, VaultOrganizationClient);
