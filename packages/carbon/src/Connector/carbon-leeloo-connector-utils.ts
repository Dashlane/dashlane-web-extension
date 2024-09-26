import { makeAccountCreationController } from "Account/Creation/AccountCreationController";
import * as communication from "@dashlane/communication";
import { sendTypedExceptionLog } from "Logs/Exception";
import { PersistData } from "Session/types";
import { getLocalAccounts } from "Authentication";
import { CarbonServices, getCoreServices } from "Services";
import { makeSessionController } from "Session/SessionController";
import * as onboardingController from "Session/OnboardingController";
import { makeLoginController } from "Login/LoginController";
import { makeRecoveryController } from "Recovery/RecoveryController";
import { makeTeamAdminController } from "TeamAdmin/TeamAdminController";
import { makeDirectorySyncController } from "TeamAdmin/DirectorySyncController";
import { makeSharingService } from "Sharing/2/Services";
import { makeStaticDataController } from "StaticData/StaticDataController";
import { makeSettingsController } from "Team/SettingsController";
import { makeDataManagementController } from "DataManagement/DataManagementController";
import { setEventBus } from "./CarbonLeelooConnector";
export function subscribeToLeelooEvents(
  eventBus: typeof communication.CarbonLeelooConnector,
  carbonServices: CarbonServices
): void {
  setEventBus(eventBus);
  const coreServices = getCoreServices(carbonServices);
  const {
    storeService,
    localStorageService,
    wsService,
    sessionService,
    storageService,
  } = coreServices;
  const accountCreationController = makeAccountCreationController(coreServices);
  const sessionController = makeSessionController(coreServices);
  const loginController = makeLoginController(coreServices);
  const dataManagementController = makeDataManagementController(coreServices);
  const recoveryController = makeRecoveryController(storeService, wsService);
  const settingsController = makeSettingsController(storeService, wsService);
  const teamAdminController = makeTeamAdminController(storeService, wsService);
  const sharingService = makeSharingService(storeService, wsService);
  const directorySyncController = makeDirectorySyncController({
    storeService,
    localStorageService,
    wsService,
    sessionService,
    sharingService,
  });
  const staticDataController = makeStaticDataController();
  eventBus.getUki.on(() => sessionController.getUki());
  eventBus.savePaymentCard.on((event) => {
    dataManagementController.savePaymentCardFromClient(event);
  });
  eventBus.savePersonalDataItem.on((event) => {
    return dataManagementController.savePersonalDataItem(event);
  });
  eventBus.removePersonalDataItem.on((event) => {
    return dataManagementController.removePersonalDataItem(
      event.id,
      event.ignoreSharing
    );
  });
  eventBus.getAccountInfo.on(() =>
    sessionController.getAndTriggerRefreshAccountInfo()
  );
  eventBus.getLocalAccountsList.on(() =>
    getLocalAccounts(storeService, storageService).then((localAccounts) => ({
      localAccounts,
    }))
  );
  eventBus.cancelPremiumSubscription.on(() =>
    sessionController.cancelPremiumSubscription()
  );
  eventBus.getInvoices.on(() =>
    sessionController.getInvoices().then((invoices) => ({ invoices }))
  );
  eventBus.closeSession.on(() => sessionController.closeSession());
  eventBus.lockSession.on(() => sessionController.lockSession());
  eventBus.resumeSession.on(() => sessionController.resumeSession());
  eventBus.getPersonalSettings.on(() =>
    sessionController
      .getPersonalSettings()
      .then((personalSettings) => personalSettings)
  );
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
    loginController.openSessionWithOTP(
      event.login,
      event.password,
      event.otp,
      undefined,
      event.withBackupCode
    );
  });
  eventBus.openSessionWithOTPForNewDevice.on(
    ({ login, password, otp, persistData, deviceName, withBackupCode }) => {
      loginController.openSessionWithOTPForNewDevice(
        login,
        password,
        otp,
        persistData
          ? PersistData.PERSIST_DATA_YES
          : PersistData.PERSIST_DATA_NO,
        deviceName,
        withBackupCode
      );
    }
  );
  eventBus.sessionForceSync.on((event) =>
    sessionController.sessionForceSync(event.trigger)
  );
  eventBus.exceptionLog.on((log) =>
    sendTypedExceptionLog("leelooException", log)
  );
  eventBus.teamUpdated.on((event) =>
    teamAdminController.teamUpdateHandler(event).then((errors) => ({ errors }))
  );
  eventBus.createUserGroup.on((event) =>
    teamAdminController.createUserGroupAction(sessionService, event)
  );
  eventBus.deleteUserGroup.on((event) =>
    teamAdminController.deleteUserGroupAction(event)
  );
  eventBus.renameUserGroup.on((event) =>
    teamAdminController.renameUserGroupAction(event)
  );
  eventBus.inviteUserGroupMembers.on((event) =>
    teamAdminController.inviteUserGroupMembersAction(event)
  );
  eventBus.revokeUserGroupMembers.on((event) =>
    teamAdminController.revokeUserGroupMembersAction(event)
  );
  eventBus.updateUserGroupMembers.on((event) =>
    teamAdminController.updateUserGroupMembersAction(event)
  );
  eventBus.createAccountStep1.on((event) =>
    accountCreationController.createAccount(event)
  );
  eventBus.createAccountStep2.on((event) =>
    accountCreationController.confirmAccountCreation(event)
  );
  eventBus.checkLogin.on((event) =>
    accountCreationController.checkLogin(event)
  );
  eventBus.getMasterPasswordResetDemandList.on((event) =>
    recoveryController.getMasterPasswordResetDemandList(event)
  );
  eventBus.acceptMasterPasswordResetDemand.on((event) =>
    recoveryController.acceptMasterPasswordResetDemand(event)
  );
  eventBus.checkIfMasterPasswordIsValid.on((event) =>
    sessionController
      .validateMasterPassword(event.masterPassword)
      .then((isMasterPasswordValid) => ({
        isMasterPasswordValid: isMasterPasswordValid,
      }))
  );
  eventBus.declineMasterPasswordResetDemand.on((event) =>
    recoveryController.declineMasterPasswordResetDemand(event)
  );
  eventBus.getMembers.on((event) => teamAdminController.getMembers(event));
  eventBus.addTeamAdmin.on((event) => teamAdminController.addTeamAdmin(event));
  eventBus.removeTeamAdmin.on((event) =>
    teamAdminController.removeTeamAdmin(event)
  );
  eventBus.setTeamSettings.on((event) =>
    settingsController.setTeamSettings(event)
  );
  eventBus.updateWebOnboardingMode.on((webOnboardingMode) =>
    onboardingController.updateWebOnboardingMode(
      storeService,
      sessionService,
      webOnboardingMode
    )
  );
  eventBus.checkDirectorySyncKeyResponse.on((event) => {
    const { teamId, publicKey, requestId, response } = event;
    if (response === "validated") {
      directorySyncController.keyValidatedByTacAdmin(teamId, publicKey);
    } else if (response === "rejected") {
      directorySyncController.keyRejectedByTacAdmin(teamId, requestId);
    }
  });
  eventBus.queryStaticDataCollections.on((request) =>
    staticDataController.query(request)
  );
}
