import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { vaultItemsCrudApi } from "./api";
export abstract class VaultItemsCrudClient extends defineModuleClient(
  vaultItemsCrudApi
) {}
registerModuleClient(vaultItemsCrudApi, VaultItemsCrudClient);
