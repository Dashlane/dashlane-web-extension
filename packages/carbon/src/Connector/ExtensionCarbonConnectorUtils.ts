import * as communication from "@dashlane/communication";
import { getCommonAppSetting } from "Application/ApplicationSettings";
import { getLocalAccounts } from "Authentication";
import { sendTypedExceptionLog } from "Logs/Exception";
import * as onboardingController from "Session/OnboardingController";
import { PersistData } from "Session/types";
import { CarbonServices, getCoreServices } from "Services";
import { makeSessionController } from "Session/SessionController";
import { makeLoginController } from "Login/LoginController";
import { setEventBus } from "./ExtensionCarbonConnector";
export function subscribeToExtensionEvents(
  eventBus: typeof communication.ExtensionCarbonConnector,
  carbonServices: CarbonServices
): void {
  setEventBus(eventBus);
  const coreServices = getCoreServices(carbonServices);
  const { storeService, storageService } = coreServices;
  const loginController = makeLoginController(coreServices);
  const sessionController = makeSessionController(coreServices);
  eventBus.getAccountInfo.on(() =>
    sessionController.getAndTriggerRefreshAccountInfo()
  );
  eventBus.getLocalAccountsList.on(() =>
    getLocalAccounts(storeService, storageService).then((localAccounts) => ({
      localAccounts,
    }))
  );
  eventBus.getAnonymousLogsMetadata.on(() => ({
    anonymouscomputerid: getCommonAppSetting("anonymousComputerId"),
  }));
  eventBus.askWebsiteInfo.on(({ fullUrl }) => {
    const websiteOptions: communication.WebsiteOptions =
      sessionController.askWebsiteInfo(fullUrl);
    return websiteOptions;
  });
  eventBus.checkIfMasterPasswordIsValid.on((event) =>
    sessionController
      .validateMasterPassword(event.masterPassword)
      .then((isMasterPasswordValid) => ({ isMasterPasswordValid }))
  );
  eventBus.closeSession.on(() => sessionController.closeSession());
  eventBus.lockSession.on(() => sessionController.lockSession());
  eventBus.openSession.on(({ login, password }) =>
    loginController.openSession(login, { password })
  );
  eventBus.openSessionWithToken.on(
    ({ login, password, token, persistData, deviceName }) => {
      loginController.openSessionWithToken(
        login,
        password,
        token,
        persistData
          ? PersistData.PERSIST_DATA_YES
          : PersistData.PERSIST_DATA_NO,
        deviceName
      );
    }
  );
  eventBus.openSessionWithDashlaneAuthenticator.on(
    ({ login, password, persistData, deviceName }) => {
      loginController.openSessionWithDashlaneAuthenticator(
        login,
        password,
        persistData
          ? PersistData.PERSIST_DATA_YES
          : PersistData.PERSIST_DATA_NO,
        deviceName
      );
    }
  );
  eventBus.cancelDashlaneAuthenticatorRegistration.on(() => {
    loginController.cancelDashlaneAuthenticatorRegistration();
  });
  eventBus.openSessionResendToken.on((event) => {
    loginController.openSessionResendToken(event.login);
  });
  eventBus.openSessionWithOTP.on((event) => {
    loginController.openSessionWithOTP(event.login, event.password, event.otp);
  });
  eventBus.openSessionWithOTPForNewDevice.on(
    ({ login, password, otp, persistData, deviceName }) => {
      loginController.openSessionWithOTPForNewDevice(
        login,
        password,
        otp,
        persistData
          ? PersistData.PERSIST_DATA_YES
          : PersistData.PERSIST_DATA_NO,
        deviceName
      );
    }
  );
  eventBus.sessionForceSync.on((event) => {
    sessionController.sessionForceSync(event.trigger);
  });
  eventBus.updateWebOnboardingMode.on((webOnboardingMode) => {
    onboardingController.updateWebOnboardingMode(
      coreServices.storeService,
      coreServices.sessionService,
      webOnboardingMode
    );
  });
  eventBus.exceptionLog.on((log) =>
    sendTypedExceptionLog("extensionException", log)
  );
}
