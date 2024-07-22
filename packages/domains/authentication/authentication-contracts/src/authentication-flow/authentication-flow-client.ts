import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { authenticationFlowApi } from "./authentication-flow.api";
export abstract class AuthenticationFlowClient extends defineModuleClient(
  authenticationFlowApi
) {}
registerModuleClient(authenticationFlowApi, AuthenticationFlowClient);
