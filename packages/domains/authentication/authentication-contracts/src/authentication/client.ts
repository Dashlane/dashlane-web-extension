import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { authenticationApi } from ".";
export abstract class AuthenticationClient extends defineModuleClient(
  authenticationApi
) {}
registerModuleClient(authenticationApi, AuthenticationClient);
