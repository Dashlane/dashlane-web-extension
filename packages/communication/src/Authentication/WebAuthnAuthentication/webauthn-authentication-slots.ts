import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import {
  AuthenticatorDetails,
  DisableWebAuthnAuthenticationResult,
  EnableWebAuthnAuthenticationRequest,
  EnableWebAuthnAuthenticationResult,
  InitEnableWebAuthnAuthenticationRequest,
  InitEnableWebAuthnAuthenticationResult,
  InitOpenSessionWithWebAuthnAuthenticatorRequest,
  InitOpenSessionWithWebAuthnAuthenticatorResult,
  InitRegisterWebAuthnAuthenticatorRequest,
  InitRegisterWebAuthnAuthenticatorResult,
  InitUserVerificationWithWebAuthnRequest,
  InitUserVerificationWithWebAuthnResult,
  OpenSessionWithWebAuthnAuthenticatorRequest,
  OpenSessionWithWebAuthnAuthenticatorResult,
  RefreshAvailableWebAuthnAuthenticatorsRequest,
  RefreshAvailableWebAuthnAuthenticatorsResult,
  RefreshWebAuthnAuthenticatorsResult,
  RegisterWebAuthnAuthenticatorRequest,
  RegisterWebAuthnAuthenticatorResult,
  RemoveWebAuthnAuthenticatorRequest,
  RemoveWebAuthnAuthenticatorResult,
} from "./types";
export const webAuthnAuthenticationCommandsSlots = {
  enableWebAuthnAuthentication: slot<
    EnableWebAuthnAuthenticationRequest,
    EnableWebAuthnAuthenticationResult
  >(),
  initEnableWebAuthnAuthentication: slot<
    InitEnableWebAuthnAuthenticationRequest,
    InitEnableWebAuthnAuthenticationResult
  >(),
  refreshAvailableWebAuthnAuthenticators: slot<
    RefreshAvailableWebAuthnAuthenticatorsRequest,
    RefreshAvailableWebAuthnAuthenticatorsResult
  >(),
  refreshWebAuthnAuthenticators: slot<
    void,
    RefreshWebAuthnAuthenticatorsResult
  >(),
  initRegisterWebAuthnAuthenticator: slot<
    InitRegisterWebAuthnAuthenticatorRequest,
    InitRegisterWebAuthnAuthenticatorResult
  >(),
  registerWebAuthnAuthenticator: slot<
    RegisterWebAuthnAuthenticatorRequest,
    RegisterWebAuthnAuthenticatorResult
  >(),
  initOpenSessionWithWebAuthnAuthenticator: slot<
    InitOpenSessionWithWebAuthnAuthenticatorRequest,
    InitOpenSessionWithWebAuthnAuthenticatorResult
  >(),
  openSessionWithWebAuthnAuthenticator: slot<
    OpenSessionWithWebAuthnAuthenticatorRequest,
    OpenSessionWithWebAuthnAuthenticatorResult
  >(),
  disableWebAuthnAuthentication: slot<
    void,
    DisableWebAuthnAuthenticationResult
  >(),
  removeWebAuthnAuthenticator: slot<
    RemoveWebAuthnAuthenticatorRequest,
    RemoveWebAuthnAuthenticatorResult
  >(),
  initUserVerificationWithWebAuthn: slot<
    InitUserVerificationWithWebAuthnRequest,
    InitUserVerificationWithWebAuthnResult
  >(),
};
export const webAuthnAuthenticationQueriesSlots = {
  getWebAuthnAuthenticators: slot<void, AuthenticatorDetails[]>(),
  getWebAuthnAuthenticationOptedIn: slot<void, boolean>(),
};
export const webAuthnAuthenticationLiveQueriesSlots = {
  liveWebAuthnAuthenticators: liveSlot<AuthenticatorDetails[]>(),
  liveWebAuthnAuthenticationOptedIn: liveSlot<boolean>(),
};
