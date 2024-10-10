import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
import { wipeOutLocalAccounts } from "UserManagement";
import { stopTwoFactorAuthenticationStage } from "../Store";
export const enableTwoFactorAuthenticationLogoutRequiredHandler = async (
  coreServices: CoreServices
) => {
  const { storeService, storageService, sessionService, moduleClients } =
    coreServices;
  const login = userLoginSelector(storeService.getState());
  storeService.dispatch(stopTwoFactorAuthenticationStage());
  if (login) {
    await wipeOutLocalAccounts(storageService, moduleClients["carbon-legacy"], [
      login,
    ]);
  }
  await sessionService.close();
  return { success: true };
};
