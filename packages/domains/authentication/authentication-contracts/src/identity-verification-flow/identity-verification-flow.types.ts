import {
  defineModuleClient,
  registerModuleClient,
} from "@dashlane/framework-contracts";
import { identityVerificationFlowApi } from "./identity-verification-flow.api";
export abstract class IdentityVerificationClient extends defineModuleClient(
  identityVerificationFlowApi
) {}
registerModuleClient(identityVerificationFlowApi, IdentityVerificationClient);
export type IdentityVerificationFlowViewStep =
  | "StartingStep"
  | "EmailTokenStep"
  | "DashlaneAuthenticatorStep"
  | "TwoFactorAuthenticationOtpStep";
export interface IdentityVerificationFlowBaseView {
  readonly error?: string;
  readonly isLoading?: boolean;
}
export interface IdentityVerificationFlowStartingView
  extends IdentityVerificationFlowBaseView {
  readonly step: "StartingStep";
}
export interface IdentityVerificationFlowEmailTokenView
  extends IdentityVerificationFlowBaseView {
  readonly step: "EmailTokenStep";
  readonly emailToken?: string;
  readonly isDashlaneAuthenticatorAvailable?: boolean;
}
export type IdentityVerificationFlowTwoFactorAuthenticationOtpType =
  | "totp"
  | "backupCode";
export type IdentityVerificationFlowOtpVerificationMode = "otp1" | "otp2";
export interface IdentityVerificationFlowTwoFactorAuthenticationOtpView
  extends IdentityVerificationFlowBaseView {
  readonly step: "TwoFactorAuthenticationOtpStep";
  readonly twoFactorAuthenticationOtpValue?: string;
  readonly twoFactorAuthenticationOtpType?: IdentityVerificationFlowTwoFactorAuthenticationOtpType;
}
export interface IdentityVerificationFlowDashlaneAuthenticatorView
  extends IdentityVerificationFlowBaseView {
  readonly step: "DashlaneAuthenticatorStep";
}
export type IdentityVerificationFlowView =
  | IdentityVerificationFlowStartingView
  | IdentityVerificationFlowEmailTokenView
  | IdentityVerificationFlowTwoFactorAuthenticationOtpView
  | IdentityVerificationFlowDashlaneAuthenticatorView
  | undefined;
export interface SubmitEmailTokenCommandRequest {
  readonly emailToken: string;
  readonly deviceName: string;
}
export interface SubmitTotpCommandRequest {
  readonly twoFactorAuthenticationOtpValue: string;
}
export interface SubmitBackupCodeCommandRequest {
  readonly twoFactorAuthenticationOtpValue: string;
}
export interface ChangeTwoFactorAuthenticationOtpTypeCommandRequest {
  readonly twoFactorAuthenticationOtpType: IdentityVerificationFlowTwoFactorAuthenticationOtpType;
}
export interface StartIdentityVerificationCommandRequest {
  readonly login: string;
  readonly verificationMethod:
    | "email_token"
    | "totp"
    | "duo_push"
    | "sso"
    | "dashlane_authenticator"
    | "u2f";
}
