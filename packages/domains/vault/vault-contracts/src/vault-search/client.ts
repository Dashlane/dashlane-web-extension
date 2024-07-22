import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { vaultSearchApi } from "./api";
export abstract class VaultSearchClient extends defineModuleClient(
  vaultSearchApi
) {}
registerModuleClient(vaultSearchApi, VaultSearchClient);
