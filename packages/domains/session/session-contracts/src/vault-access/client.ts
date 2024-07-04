import { defineModuleClient, registerModuleClient, } from '@dashlane/framework-contracts';
import { vaultAccessApi } from './api';
export abstract class VaultAccessClient extends defineModuleClient(vaultAccessApi) {
}
registerModuleClient(vaultAccessApi, VaultAccessClient);
