import {
  LoginResultEnum,
  OpenSessionWithMasterPassword,
} from "@dashlane/communication";
import { makeLoginController } from "Login/LoginController";
import { CoreServices } from "Services";
export function openSessionWithMasterPasswordHandler(
  coreServices: CoreServices,
  event: OpenSessionWithMasterPassword
): Promise<LoginResultEnum> {
  const loginController = makeLoginController(coreServices);
  return loginController.openSessionWithMasterPassword(
    event.login,
    event.password,
    {
      rememberMasterPassword: event.rememberPassword,
      requiredPermissions: event.requiredPermissions,
      serverKey: event.serverKey,
      loginType: event.loginType,
    }
  );
}
