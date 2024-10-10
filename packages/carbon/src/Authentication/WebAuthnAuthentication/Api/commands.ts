import {
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
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type WebAuthnAuthenticationCommands = {
  enableWebAuthnAuthentication: Command<
    EnableWebAuthnAuthenticationRequest,
    EnableWebAuthnAuthenticationResult
  >;
  initEnableWebAuthnAuthentication: Command<
    InitEnableWebAuthnAuthenticationRequest,
    InitEnableWebAuthnAuthenticationResult
  >;
  initRegisterWebAuthnAuthenticator: Command<
    InitRegisterWebAuthnAuthenticatorRequest,
    InitRegisterWebAuthnAuthenticatorResult
  >;
  registerWebAuthnAuthenticator: Command<
    RegisterWebAuthnAuthenticatorRequest,
    RegisterWebAuthnAuthenticatorResult
  >;
  refreshWebAuthnAuthenticators: Command<
    void,
    RefreshWebAuthnAuthenticatorsResult
  >;
  refreshAvailableWebAuthnAuthenticators: Command<
    RefreshAvailableWebAuthnAuthenticatorsRequest,
    RefreshAvailableWebAuthnAuthenticatorsResult
  >;
  initOpenSessionWithWebAuthnAuthenticator: Command<
    InitOpenSessionWithWebAuthnAuthenticatorRequest,
    InitOpenSessionWithWebAuthnAuthenticatorResult
  >;
  openSessionWithWebAuthnAuthenticator: Command<
    OpenSessionWithWebAuthnAuthenticatorRequest,
    OpenSessionWithWebAuthnAuthenticatorResult
  >;
  disableWebAuthnAuthentication: Command<
    void,
    DisableWebAuthnAuthenticationResult
  >;
  removeWebAuthnAuthenticator: Command<
    RemoveWebAuthnAuthenticatorRequest,
    RemoveWebAuthnAuthenticatorResult
  >;
  initUserVerificationWithWebAuthn: Command<
    InitUserVerificationWithWebAuthnRequest,
    InitUserVerificationWithWebAuthnResult
  >;
};
