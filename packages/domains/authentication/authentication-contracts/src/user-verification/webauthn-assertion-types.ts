export type Base64URLString = string;
type AuthenticatorTransportJSON = "ble" | "hybrid" | "internal" | "nfc" | "usb";
type PublicKeyCredentialTypeJSON = "public-key";
export interface PublicKeyCredentialDescriptorJSON {
  id: Base64URLString;
  transports?: AuthenticatorTransportJSON[];
  type: PublicKeyCredentialTypeJSON;
}
export interface PublicKeyCredentialUserEntityJSON {
  id: Base64URLString;
  displayName: string;
  name: string;
}
type AttestationConveyancePreferenceJSON =
  | "direct"
  | "enterprise"
  | "indirect"
  | "none";
type AuthenticatorAttachmentJSON = "cross-platform" | "platform";
type ResidentKeyRequirementJSON = "discouraged" | "preferred" | "required";
type UserVerificationRequirementJSON = "discouraged" | "preferred" | "required";
export type PublicKeyCredentialHints =
  | "security-key"
  | "client-device"
  | "hybrid";
interface AuthenticatorSelectionCriteriaJSON {
  authenticatorAttachment?: AuthenticatorAttachmentJSON;
  requireResidentKey?: boolean;
  residentKey?: ResidentKeyRequirementJSON;
  userVerification?: UserVerificationRequirementJSON;
}
interface AuthenticationExtensionsClientInputsJSON {
  appid?: string;
  credProps?: boolean;
  hmacCreateSecret?: boolean;
}
interface PublicKeyCredentialParametersJSON {
  alg: number;
  type: PublicKeyCredentialTypeJSON;
}
interface PublicKeyCredentialRpEntityJSON {
  name: string;
  id?: string;
}
export interface PublicKeyCredentialCreationOptionsJSON {
  user: PublicKeyCredentialUserEntityJSON;
  challenge: Base64URLString;
  excludeCredentials: PublicKeyCredentialDescriptorJSON[];
  attestation?: AttestationConveyancePreferenceJSON;
  authenticatorSelection?: AuthenticatorSelectionCriteriaJSON;
  extensions?: AuthenticationExtensionsClientInputsJSON;
  pubKeyCredParams: PublicKeyCredentialParametersJSON[];
  rp: PublicKeyCredentialRpEntityJSON;
  timeout?: number;
}
export interface PublicKeyCredentialRequestOptionsJSON {
  extensions?: AuthenticationExtensionsClientInputsJSON;
  rpId?: string;
  timeout?: number;
  userVerification?: UserVerificationRequirementJSON;
  challenge: Base64URLString;
  allowCredentials?: PublicKeyCredentialDescriptorJSON[];
}
export interface PublicKeyCredentialCreationOptionsJSONFuture
  extends PublicKeyCredentialCreationOptionsJSON {
  hints?: PublicKeyCredentialHints[];
}
export interface PublicKeyCredentialRequestOptionsJSONFuture
  extends PublicKeyCredentialRequestOptionsJSON {
  hints?: PublicKeyCredentialHints[];
}
export interface AuthenticatorAttestationResponseJSON {
  clientDataJSON: Base64URLString;
  attestationObject: Base64URLString;
}
export interface AttestationCredentialJSONCustom {
  readonly id: string;
  readonly type: PublicKeyCredentialTypeJSON;
  rawId: Base64URLString;
  response: AuthenticatorAttestationResponseJSON;
  transports?: AuthenticatorTransportJSON[];
}
export interface AttestationCredentialJSON {
  rawId: Base64URLString;
  response: AuthenticatorAttestationResponseJSON;
  transports?: AuthenticatorTransportJSON[];
  readonly authenticatorAttachment: string | null;
  readonly id: string;
  readonly type: string;
}
export interface AuthenticatorAssertionResponseJSON {
  authenticatorData: Base64URLString;
  clientDataJSON: Base64URLString;
  signature: Base64URLString;
  userHandle?: Base64URLString;
}
interface CredentialPropertiesOutputJSON {
  rk?: boolean;
}
interface AuthenticationExtensionsClientOutputsJSON {
  appid?: boolean;
  credProps?: CredentialPropertiesOutputJSON;
  hmacCreateSecret?: boolean;
}
export interface AssertionCredentialJSON {
  readonly authenticatorAttachment: string | null;
  readonly id: string;
  readonly type: PublicKeyCredentialTypeJSON;
  rawId: Base64URLString;
  response: AuthenticatorAssertionResponseJSON;
  clientExtensionResults?: AuthenticationExtensionsClientOutputsJSON;
}
export interface AssertionCredentialJSONCustom {
  readonly id: string;
  readonly type: PublicKeyCredentialTypeJSON;
  rawId: Base64URLString;
  response: AuthenticatorAssertionResponseJSON;
  clientExtensionResults?: AuthenticationExtensionsClientOutputsJSON;
}
export interface ValidateWebauthnAssertionCommandRequest {
  readonly assertion: AssertionCredentialJSONCustom;
  readonly login?: string;
}
