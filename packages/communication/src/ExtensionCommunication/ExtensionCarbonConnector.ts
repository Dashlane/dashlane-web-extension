import { slot } from "ts-event-bus";
import * as OpenSessionEvents from "./../OpenSession";
import { WebOnboardingModeEvent } from "./../Onboarding";
import * as Logging from "./../Logging";
import { LoginResultEnum } from "../Login";
import {
  CheckIfMasterPasswordIsValidRequest,
  CheckIfMasterPasswordIsValidResponse,
} from "../MasterPassword";
export const ExtensionCarbonConnector = {
  carbonLoginStatusChanged: slot<OpenSessionEvents.LoginStatusChanged>({
    noBuffer: true,
  }),
  localAccountsListUpdated: slot<OpenSessionEvents.LocalAccountsListUpdated>({
    noBuffer: true,
  }),
  openSessionProgressChanged:
    slot<OpenSessionEvents.OpenSessionProgressChanged>({ noBuffer: true }),
  openSessionTokenSent: slot<OpenSessionEvents.OpenSessionTokenSent>({
    noBuffer: true,
  }),
  openSessionDashlaneAuthenticator: slot<void>({ noBuffer: true }),
  openSessionOTPSent: slot<OpenSessionEvents.OpenSessionOTPSent>({
    noBuffer: true,
  }),
  openSessionOTPForNewDeviceRequired: slot<void>({ noBuffer: true }),
  openSessionAskMasterPassword:
    slot<OpenSessionEvents.OpenSessionAskMasterPassword>({
      noBuffer: true,
    }),
  openSessionTokenWarning: slot<OpenSessionEvents.OpenSessionTokenWarning>({
    noBuffer: true,
  }),
  openSessionExtraDeviceTokenRequired: slot<void>({ noBuffer: true }),
  openSessionMasterPasswordLess: slot<void>({ noBuffer: true }),
  openSessionSsoRedirectionToIdpRequired:
    slot<OpenSessionEvents.OpenSessionSsoRedirectionToIdpRequired>({
      noBuffer: true,
    }),
  openSessionFailed: slot<OpenSessionEvents.OpenSessionFailed>({
    noBuffer: true,
  }),
  sessionSyncStatus: slot<OpenSessionEvents.SessionSyncStatus>({
    noBuffer: true,
  }),
  accountFeaturesChanged: slot<OpenSessionEvents.AccountFeatures>({
    noBuffer: true,
  }),
  webOnboardingModeUpdated: slot<WebOnboardingModeEvent>({ noBuffer: true }),
  askWebsiteInfo: slot<
    OpenSessionEvents.AskWebsiteInfo,
    OpenSessionEvents.WebsiteOptions
  >({ noBuffer: true }),
  getAccountInfo: slot<null, OpenSessionEvents.AccountInfo>({
    noBuffer: true,
  }),
  getAnonymousLogsMetadata: slot<null, Logging.AnonymousLogsMetadata>({
    noBuffer: true,
  }),
  checkIfMasterPasswordIsValid: slot<
    CheckIfMasterPasswordIsValidRequest,
    CheckIfMasterPasswordIsValidResponse
  >({ noBuffer: true }),
  openSession: slot<OpenSessionEvents.OpenSession, LoginResultEnum>({
    noBuffer: true,
  }),
  openSessionWithToken: slot<OpenSessionEvents.OpenSessionWithToken>({
    noBuffer: true,
  }),
  openSessionWithDashlaneAuthenticator:
    slot<OpenSessionEvents.OpenSessionWithDashlaneAuthenticator>({
      noBuffer: true,
    }),
  cancelDashlaneAuthenticatorRegistration: slot<void>(),
  openSessionWithOTP: slot<OpenSessionEvents.OpenSessionWithOTP>({
    noBuffer: true,
  }),
  openSessionWithOTPForNewDevice:
    slot<OpenSessionEvents.OpenSessionWithOTPForNewDevice>({
      noBuffer: true,
    }),
  openSessionResendToken: slot<OpenSessionEvents.OpenSessionResendToken>({
    noBuffer: true,
  }),
  sessionForceSync: slot<OpenSessionEvents.SessionForceSync>({
    noBuffer: true,
  }),
  closeSession: slot<OpenSessionEvents.CloseSession>({ noBuffer: true }),
  lockSession: slot<OpenSessionEvents.LockSession>({ noBuffer: true }),
  exceptionLog: slot<Logging.ExceptionLog>({ noBuffer: true }),
  getDevicesList: slot<null, OpenSessionEvents.GetDevicesList>({
    noBuffer: true,
  }),
  getLocalAccountsList: slot<null, OpenSessionEvents.GetLocalAccountsList>({
    noBuffer: true,
  }),
  reloadExtension: slot<boolean>({ noBuffer: true }),
  updateWebOnboardingMode: slot<WebOnboardingModeEvent>({ noBuffer: true }),
};
