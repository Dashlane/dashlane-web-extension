import {
  type AccountFeatures,
  AuthenticationCode,
  type CurrentLocationUpdated,
  ExceptionCriticality,
  type LocalAccountInfo,
  type LoginStatusChanged,
  type OpenSessionOTPSent,
  type OpenSessionTokenSent,
  ServerSidePairingStatus,
  type ServerSidePairingStatusChanged,
  type SessionSyncStatus,
  Space,
  SpaceMemberRights,
  type TeamAdminDataUpdatedEvent,
  type UpdatePaymentCardTokenResult,
  type WebOnboardingModeEvent,
} from "@dashlane/communication";
import extension from "Connector/ExtensionCarbonConnector";
import leeloo from "Connector/CarbonLeelooConnector";
import { sendExceptionLog } from "Logs/Exception";
import Debugger, { logDebug } from "Logs/Debugger";
import { StoreService } from "Store/index";
import { isCarbonError } from "Libs/Error";
import { HttpError, HttpErrorCode } from "Libs/Http";
import { StorageService } from "Libs/Storage/types";
import { getLocalAccounts } from "Authentication";
import { SessionResumingCode } from "Session/types";
import { ssoMigrationInfoSelector } from "Session/sso.selectors";
import { getNodePremiumStatusSpaceData } from "Store/helpers/spaceData";
import { didOpenSelector } from "./selectors";
export { AuthenticationCode, SessionResumingCode };
export function triggerOpenSessionOTPSent(event: OpenSessionOTPSent) {
  Debugger.log("Ask for OTP");
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionOTPSent(event);
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionOTPSent(event);
  }
}
export function triggerOpenSessionOTPForNewDeviceRequired() {
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionOTPForNewDeviceRequired();
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionOTPForNewDeviceRequired();
  }
}
export function triggerAskMasterPassword(login: string) {
  Debugger.log("Ask for master password");
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionAskMasterPassword({ login });
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionAskMasterPassword({ login });
  }
}
export function triggerOpenSessionTokenSent(event: OpenSessionTokenSent) {
  Debugger.log("Ask for new device e-mail token");
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionTokenSent(event);
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionTokenSent(event);
  }
}
export function triggerOpenSessionDashlaneAuthenticator() {
  logDebug({
    message: "Ask for new device dashlane authenticator push notification",
  });
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionDashlaneAuthenticator();
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionDashlaneAuthenticator();
  }
}
export function triggerOpenSessionExtraDeviceTokenRequired() {
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionExtraDeviceTokenRequired();
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionExtraDeviceTokenRequired();
  }
}
export function triggerOpenSessionSsoRedirectionToIdpRequired(
  serviceProviderRedirectUrl: string,
  isNitroProvider: boolean
) {
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionSsoRedirectionToIdpRequired({
      serviceProviderRedirectUrl,
      isNitroProvider,
    });
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionSsoRedirectionToIdpRequired({
      serviceProviderRedirectUrl,
      isNitroProvider,
    });
  }
}
export function triggerOpenSessionMasterPasswordLess() {
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionMasterPasswordLess();
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionMasterPasswordLess();
  }
}
export function triggerLoginStatusChanged(event: LoginStatusChanged) {
  Debugger.log(`Session status updated for ${event.login}`);
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.carbonLoginStatusChanged(event);
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.carbonLoginStatusChanged(event);
  }
}
export function triggerServerSidePairingStatusChanged(
  event: ServerSidePairingStatusChanged
) {
  if (leeloo) {
    const leelooConnector = leeloo();
    if (leelooConnector) {
      leelooConnector.serverSidePairingStatusChanged(event);
    }
  }
}
export function getAuthenticationCodeFromError(
  error: Error
): AuthenticationCode {
  let errorCode: AuthenticationCode =
    error &&
    error.message &&
    typeof AuthenticationCode[error.message] !== "undefined"
      ? AuthenticationCode[error.message]
      : AuthenticationCode.UNKNOWN_ERROR;
  if (errorCode === AuthenticationCode.UNKNOWN_ERROR) {
    if (isCarbonError(error, HttpError, HttpErrorCode.NETWORK_ERROR)) {
      errorCode = AuthenticationCode.NETWORK_ERROR;
    }
    if (error?.message?.includes("TOKEN_NOT_VALID")) {
      errorCode = AuthenticationCode.TOKEN_NOT_VALID;
    }
  }
  return errorCode;
}
export function triggerOpenSessionFailed(error: Error) {
  Debugger.log("Failed to open Session");
  Debugger.log(`error: ${error}`);
  const errorCode = getAuthenticationCodeFromError(error);
  const errorMessage =
    errorCode === AuthenticationCode.UNKNOWN_ERROR
      ? error && error.message && typeof error.message === "string"
        ? error.message
        : "89645128"
      : "";
  const message = `[SessionCommunication] - triggerOpenSessionFailed: ${error}`;
  const augmentedError = new Error(message);
  augmentedError.stack = error.stack;
  Debugger.error(augmentedError);
  sendExceptionLog({
    error: augmentedError,
    code: getErrorLevelFromAuthenticationCode(errorCode),
  });
  const event = {
    errorCode: AuthenticationCode[errorCode],
    additionalErrorInfo: errorMessage,
    displayErrorCode: true,
  };
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.openSessionFailed(event);
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.openSessionFailed(event);
  }
}
function getErrorLevelFromAuthenticationCode(errorCode: AuthenticationCode) {
  switch (errorCode) {
    case AuthenticationCode.INVALID_LOGIN:
    case AuthenticationCode.EMPTY_LOGIN:
    case AuthenticationCode.EMPTY_MASTER_PASSWORD:
    case AuthenticationCode.EMPTY_TOKEN:
    case AuthenticationCode.EMPTY_OTP:
    case AuthenticationCode.NETWORK_ERROR:
    case AuthenticationCode.USER_DOESNT_EXIST:
    case AuthenticationCode.OTP_NOT_VALID:
    case AuthenticationCode.TOKEN_NOT_VALID:
    case AuthenticationCode.TOKEN_TOO_MANY_ATTEMPTS:
    case AuthenticationCode.WRONG_PASSWORD:
      return ExceptionCriticality.WARNING;
    default:
      return ExceptionCriticality.ERROR;
  }
}
export function triggerSessionOpened(
  storeService: StoreService,
  storageService: StorageService,
  pairingId?: string | null
) {
  const needsSSOMigration =
    ssoMigrationInfoSelector(storeService.getState()).migration !== undefined;
  triggerLoginStatusChanged({
    loggedIn: true,
    login: storeService.getAccountInfo().login,
    needsSSOMigration,
  });
  reportDataUpdate(storeService);
  sendWebOnboardingModeUpdate(
    storeService.getLocalSettings().webOnboardingMode
  );
  getLocalAccounts(storeService, storageService).then((localAccounts) => {
    sendLocalAccounts(localAccounts);
  });
  if (pairingId !== undefined) {
    const serverSidePairingStatus = pairingId
      ? ServerSidePairingStatus.PAIRED
      : ServerSidePairingStatus.UNPAIRED;
    triggerServerSidePairingStatusChanged({ serverSidePairingStatus });
  }
}
export function triggerExtensionReload(storeService: StoreService) {
  const sessionDidOpen = didOpenSelector(storeService.getState());
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.reloadExtension(sessionDidOpen);
  }
}
export function triggerSessionSyncStatus(event: SessionSyncStatus) {
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.sessionSyncStatus(event);
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.sessionSyncStatus(event);
  }
}
export function sendLocalAccounts(localAccounts: LocalAccountInfo[]) {
  return Promise.resolve({ localAccounts }).then((localAccountsEvent) => {
    Debugger.log("send localAccountsListUpdated to leeloo");
    const extensionConnector = extension();
    if (extensionConnector) {
      extensionConnector.localAccountsListUpdated(localAccountsEvent);
    }
    const leelooConnector = leeloo();
    if (leelooConnector) {
      leelooConnector.localAccountsListUpdated(localAccountsEvent);
    }
  });
}
export function sendLocationInfo(currentLocation: CurrentLocationUpdated) {
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.currentLocationUpdated(currentLocation);
  }
}
export function reportDataUpdate(storeService: StoreService): void {
  const spaceData = storeService.getSpaceData();
  const spaceDataWithPermissions = getNodePremiumStatusSpaceData(storeService);
  const { spaces } = spaceDataWithPermissions;
  const rights = spaces.reduce(
    (result: SpaceMemberRights, space: Space) => {
      const { isTeamAdmin, isBillingAdmin, isGroupManager } = space.details;
      return {
        isTeamAdmin: isTeamAdmin || result.isTeamAdmin,
        isBillingAdmin: isBillingAdmin || result.isBillingAdmin,
        isGroupManager: Boolean(isGroupManager) || result.isGroupManager,
      };
    },
    { isTeamAdmin: false, isBillingAdmin: false, isGroupManager: false }
  );
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.spaceDataUpdated({
      ...spaceData,
      rights,
    });
  }
}
export function updatePaymentCardTokenResult(
  updatePaymentCardTokenResult: UpdatePaymentCardTokenResult
) {
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.updatePaymentCardTokenResult(updatePaymentCardTokenResult);
  }
}
export function sendTeamAdminDataUpdate(
  teamAdminData: TeamAdminDataUpdatedEvent
) {
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.teamAdminDataUpdated(teamAdminData);
  }
}
export function sendWebOnboardingModeUpdate(
  webOnboardingMode: WebOnboardingModeEvent
) {
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.webOnboardingModeUpdated(webOnboardingMode);
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.webOnboardingModeUpdated(webOnboardingMode);
  }
}
export function sendFeatures(accountFeatures: AccountFeatures) {
  const extensionConnector = extension();
  if (extensionConnector) {
    extensionConnector.accountFeaturesChanged(accountFeatures);
  }
  const leelooConnector = leeloo();
  if (leelooConnector) {
    leelooConnector.accountFeaturesChanged(accountFeatures);
  }
}
