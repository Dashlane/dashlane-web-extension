import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { sessionApi } from "./api";
export abstract class SessionClient extends defineModuleClient(sessionApi) {}
registerModuleClient(sessionApi, SessionClient);
