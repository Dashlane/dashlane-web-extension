import { ValuesType } from "@dashlane/framework-types";
import {
  AssertionCredentialJSONCustom,
  AttestationCredentialJSONCustom,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@dashlane/authentication-contracts";
export interface AuthenticatorDetails {
  name: string;
  credentialId: string;
  creationDateUnix?: number;
  isRoaming: boolean;
  canOpenSession: boolean;
}
export const WebAuthnCallTypes = Object.freeze({
  CREATE: "webauthn.create",
  GET: "webauthn.get",
});
export type WebAuthnCallType = ValuesType<typeof WebAuthnCallTypes>;
export type PublicKeyCredentialEnableOptionsJSON =
  | PublicKeyCredentialCreationOptionsJSON
  | PublicKeyCredentialRequestOptionsJSON;
export enum InitEnableWebAuthnAuthenticationError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
export interface InitEnableWebAuthnAuthenticationRequest {
  relyingPartyId: string;
}
export interface InitEnableWebAuthnAuthenticationSuccess {
  success: true;
  response: {
    publicKeyOptions: PublicKeyCredentialEnableOptionsJSON;
    webAuthnType: WebAuthnCallType;
  };
}
export interface InitEnableWebAuthnAuthenticationFailure {
  success: false;
  error: {
    code: InitEnableWebAuthnAuthenticationError;
  };
}
export type InitEnableWebAuthnAuthenticationResult =
  | InitEnableWebAuthnAuthenticationSuccess
  | InitEnableWebAuthnAuthenticationFailure;
export enum EnableWebAuthnAuthenticationError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  USER_HAS_OTP = "USER_HAS_OTP",
  WEBAUTHN_SERVICE_INIT_FAILED = "WEBAUTHN_SERVICE_INIT_FAILED",
}
export interface EnableWebAuthnAuthenticationRequest {
  authenticationType: WebAuthnCallType;
  credential: AttestationCredentialJSONCustom | AssertionCredentialJSONCustom;
  isRoaming?: boolean;
}
export interface EnableWebAuthnAuthenticationSuccess {
  success: true;
}
export interface EnableWebAuthnAuthenticationFailure {
  success: false;
  error: {
    code: EnableWebAuthnAuthenticationError;
  };
}
export type EnableWebAuthnAuthenticationResult =
  | EnableWebAuthnAuthenticationSuccess
  | EnableWebAuthnAuthenticationFailure;
export enum InitRegisterWebAuthnAuthenticatorError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
export interface InitRegisterWebAuthnAuthenticatorRequest {
  relyingPartyId: string;
}
export interface InitRegisterWebAuthnAuthenticatorSuccess {
  success: true;
  response: {
    publicKeyOptions: PublicKeyCredentialCreationOptionsJSON;
  };
}
export interface InitRegisterWebAuthnAuthenticatorFailure {
  success: false;
  error: {
    code: InitRegisterWebAuthnAuthenticatorError;
  };
}
export type InitRegisterWebAuthnAuthenticatorResult =
  | InitRegisterWebAuthnAuthenticatorSuccess
  | InitRegisterWebAuthnAuthenticatorFailure;
export enum RegisterWebAuthnAuthenticatorError {
  USER_HAS_OTP = "USER_HAS_OTP",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
export interface RegisterWebAuthnAuthenticatorRequest {
  credential: AttestationCredentialJSONCustom;
  isRoaming: boolean;
}
export interface RegisterWebAuthnAuthenticatorSuccess {
  success: true;
}
export interface RegisterWebAuthnAuthenticatorFailure {
  success: false;
  error: {
    code: RegisterWebAuthnAuthenticatorError;
  };
}
export type RegisterWebAuthnAuthenticatorResult =
  | RegisterWebAuthnAuthenticatorSuccess
  | RegisterWebAuthnAuthenticatorFailure;
export enum RefreshWebAuthnAuthenticatorsError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
export interface RefreshWebAuthnAuthenticatorsSuccess {
  success: true;
  response: {
    authenticators: AuthenticatorDetails[];
  };
}
export interface RefreshWebAuthnAuthenticatorsFailure {
  success: false;
  error: {
    code: RefreshWebAuthnAuthenticatorsError;
  };
}
export type RefreshWebAuthnAuthenticatorsResult =
  | RefreshWebAuthnAuthenticatorsSuccess
  | RefreshWebAuthnAuthenticatorsFailure;
export enum RefreshAvailableWebAuthnAuthenticatorsError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  MISSING_SESSION_KEYS_IN_STORE = "MISSING_SESSION_KEYS_IN_STORE",
}
export interface RefreshAvailableWebAuthnAuthenticatorsRequest {
  login: string;
}
export interface RefreshAvailableWebAuthnAuthenticatorsSuccess {
  success: true;
  response: {
    authenticators: AuthenticatorDetails[];
  };
}
export interface RefreshAvailableWebAuthnAuthenticatorsFailure {
  success: false;
  error: {
    code: RefreshAvailableWebAuthnAuthenticatorsError;
  };
}
export type RefreshAvailableWebAuthnAuthenticatorsResult =
  | RefreshAvailableWebAuthnAuthenticatorsSuccess
  | RefreshAvailableWebAuthnAuthenticatorsFailure;
export enum InitOpenSessionWithWebAuthnAuthenticatorError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  UNAVAILABLE_AUTHENTICATORS = "UNAVAILABLE_AUTHENTICATORS",
  CANNOT_TRIGGER_WEBAUTHN_AUTHENTICATION = "CANNOT_TRIGGER_WEBAUTHN_AUTHENTICATION",
}
export type InitOpenSessionWithWebAuthnAuthenticatorsInfo = Pick<
  AuthenticatorDetails,
  "credentialId" | "isRoaming"
>;
export interface InitOpenSessionWithWebAuthnAuthenticatorRequest {
  relyingPartyId: string;
  login: string;
  isRoamingAutenticator?: boolean;
}
export interface InitOpenSessionWithWebAuthnAuthenticatorSuccess {
  success: true;
  response: {
    publicKeyOptions: PublicKeyCredentialRequestOptionsJSON;
    authenticatorsInfo: InitOpenSessionWithWebAuthnAuthenticatorsInfo[];
  };
}
export interface InitOpenSessionWithWebAuthnAuthenticatorFailure {
  success: false;
  error: {
    code: InitOpenSessionWithWebAuthnAuthenticatorError;
  };
}
export type InitOpenSessionWithWebAuthnAuthenticatorResult =
  | InitOpenSessionWithWebAuthnAuthenticatorSuccess
  | InitOpenSessionWithWebAuthnAuthenticatorFailure;
export enum OpenSessionWithWebAuthnAuthenticatorError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  MP_MISSING_IN_SESSION_ERROR = "MP_MISSING_IN_SESSION_ERROR",
}
export interface OpenSessionWithWebAuthnAuthenticatorRequest {
  credential: AssertionCredentialJSONCustom;
  login: string;
  isRoamingAuthenticator?: boolean | undefined;
}
export interface OpenSessionWithWebAuthnAuthenticatorSuccess {
  success: true;
}
export interface OpenSessionWithWebAuthnAuthenticatorFailure {
  success: false;
  error: {
    code: OpenSessionWithWebAuthnAuthenticatorError;
  };
}
export type OpenSessionWithWebAuthnAuthenticatorResult =
  | OpenSessionWithWebAuthnAuthenticatorSuccess
  | OpenSessionWithWebAuthnAuthenticatorFailure;
export enum DisableWebAuthnAuthenticationError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  WEBAUTHN_SERVICE_DEACTIVATE_FAILED = "WEBAUTHN_SERVICE_DEACTIVATE_FAILED",
  MISSING_LOGIN = "MISSING_LOGIN",
}
export interface DisableWebAuthnAuthenticationSuccess {
  success: true;
}
export interface DisableWebAuthnAuthenticationFailure {
  success: false;
  error: {
    code: DisableWebAuthnAuthenticationError;
  };
}
export type DisableWebAuthnAuthenticationResult =
  | DisableWebAuthnAuthenticationSuccess
  | DisableWebAuthnAuthenticationFailure;
export enum RemoveWebAuthnAuthenticatorError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  CANNOT_REMOVE_WEBAUTHN_AUTHENTICATOR = "CANNOT_REMOVE_WEBAUTHN_AUTHENTICATOR",
}
export interface RemoveWebAuthnAuthenticatorRequest {
  credentialId: string;
}
export interface RemoveWebAuthnAuthenticatorSuccess {
  success: true;
}
export interface RemoveWebAuthnAuthenticatorFailure {
  success: false;
  error: {
    code: RemoveWebAuthnAuthenticatorError;
  };
}
export type RemoveWebAuthnAuthenticatorResult =
  | RemoveWebAuthnAuthenticatorSuccess
  | RemoveWebAuthnAuthenticatorFailure;
export enum InitUserVerificationWithWebAuthnError {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  LOGGED_OUT = "LOGGED_OUT",
  CANNOT_REFRESH_WEBAUTHN_AUTHENTICATORS = "CANNOT_REFRESH_WEBAUTHN_AUTHENTICATORS",
  CANNOT_FETCH_WEBAUTHN_CHALLENGE = "CANNOT_FETCH_WEBAUTHN_CHALLENGE",
}
export interface InitUserVerificationWithWebAuthnRequest {
  relyingPartyId: string;
}
export interface InitUserVerificationWithWebAuthnSuccess {
  success: true;
  response: {
    publicKeyOptions: PublicKeyCredentialRequestOptionsJSON;
  };
}
export interface InitUserVerificationWithWebAuthnFailure {
  success: false;
  error: {
    code: InitUserVerificationWithWebAuthnError;
  };
}
export type InitUserVerificationWithWebAuthnResult =
  | InitUserVerificationWithWebAuthnSuccess
  | InitUserVerificationWithWebAuthnFailure;
