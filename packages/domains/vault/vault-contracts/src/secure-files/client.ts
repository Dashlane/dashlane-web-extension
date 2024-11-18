import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { secureFilesApi } from "./api";
export abstract class SecureFilesClient extends defineModuleClient(
  secureFilesApi
) {}
registerModuleClient(secureFilesApi, SecureFilesClient);
