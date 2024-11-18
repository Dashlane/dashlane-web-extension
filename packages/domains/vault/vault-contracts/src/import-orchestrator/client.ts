import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { importOrchestratorApi } from "./api";
export abstract class ImportOrchestratorClient extends defineModuleClient(
  importOrchestratorApi
) {}
registerModuleClient(importOrchestratorApi, ImportOrchestratorClient);
