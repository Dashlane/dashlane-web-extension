import type { Base64URLString } from "@dashlane/communication";
import {
  PublicKeyCredentialCreationOptionsJSONFuture,
  PublicKeyCredentialRequestOptionsJSONFuture,
} from "@dashlane/authentication-contracts";
export type {
  AssertionCredentialJSON,
  AttestationCredentialJSON,
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialCreationOptionsJSON,
  WebAuthnCallType,
} from "@dashlane/communication";
export enum WebAuthnStatus {
  Success = "Success",
  Error = "Error",
}
export enum WebauthnErrorName {
  NotSupportedError = "NotSupportedError",
  SecurityError = "SecurityError",
  NotAllowedError = "NotAllowedError",
  InvalidStateError = "InvalidStateError",
  UnknownError = "UnknownError",
}
export enum WebauthnOperationType {
  Create = "create",
  Get = "get",
}
interface WebauthnResultBase {
  readonly status: string;
}
interface WebauthnResultSuccess<TResult> extends WebauthnResultBase {
  readonly status: "success";
  readonly value: TResult;
}
export function isWebauthnResultSuccess<T>(
  obj: unknown
): obj is WebauthnResultSuccess<T> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "status" in obj &&
    obj.status === "success" &&
    "value" in obj &&
    typeof obj.value === "object" &&
    obj.value !== null
  );
}
export interface WebauthnResultError extends WebauthnResultBase {
  readonly status: "error";
  readonly errorName: WebauthnErrorName;
}
function isWebauthnResultError(obj: unknown): obj is WebauthnResultError {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "status" in obj &&
    obj.status === "error" &&
    "errorName" in obj &&
    typeof obj.errorName === "string"
  );
}
export interface WebauthnResultFallback extends WebauthnResultBase {
  readonly status: "useFallback";
  readonly reason:
    | "otherAuthenticator"
    | "cannotRegister"
    | "cannotAuthenticate";
}
function isWebauthnResultFallback(obj: unknown): obj is WebauthnResultFallback {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "status" in obj &&
    obj.status === "useFallback"
  );
}
export type WebauthnResult<TResult> =
  | WebauthnResultSuccess<TResult>
  | WebauthnResultFallback
  | WebauthnResultError;
export function isWebauthnResult<T>(obj: unknown): obj is WebauthnResult<T> {
  return (
    isWebauthnResultSuccess(obj) ||
    isWebauthnResultFallback(obj) ||
    isWebauthnResultError(obj)
  );
}
interface WebauthnRequestBase {
  readonly type: WebauthnOperationType;
  readonly requestId: number;
  readonly userVerificationDone?: boolean;
  readonly publickeyCredentialsPermissionList?: string[];
  readonly parentFrameId?: number;
  readonly parentFrameOrigin?: string;
}
export interface WebauthnCreationRequest extends WebauthnRequestBase {
  readonly type: WebauthnOperationType.Create;
  readonly options: PublicKeyCredentialCreationOptionsJSONFuture;
}
export type AttestationCredentialData = {
  type: string;
  rawId: Base64URLString;
  id: Base64URLString;
  clientDataJSON: Base64URLString;
  attestationObject: Base64URLString;
  authenticatorAttachment: AuthenticatorAttachment;
  authenticatorData: Base64URLString;
  publicKey: Base64URLString;
  publicKeyAlgorithm: COSEAlgorithmIdentifier;
  transports: AuthenticatorTransport[];
  clientExtensionResults?: AuthenticationExtensionsClientOutputs;
};
export type ExtendedWebauthnCreateResult =
  WebauthnResult<AttestationCredentialData>;
export interface WebauthnGetRequest extends WebauthnRequestBase {
  readonly type: WebauthnOperationType.Get;
  readonly options: PublicKeyCredentialRequestOptionsJSONFuture;
  readonly passkeyItemId?: string;
  readonly mediation?: CredentialMediationRequirement;
}
export interface WebauthnGetConditionalUiRequest extends WebauthnGetRequest {
  readonly mediation: "conditional";
}
export type WebauthnRequest = WebauthnCreationRequest | WebauthnGetRequest;
