import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { carbonLegacyApi } from "./carbon-legacy-api";
export abstract class CarbonLegacyClient extends defineModuleClient(
  carbonLegacyApi
) {}
registerModuleClient(carbonLegacyApi, CarbonLegacyClient);
