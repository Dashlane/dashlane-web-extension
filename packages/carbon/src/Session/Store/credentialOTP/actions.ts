import { Action } from "Store";
import { CredentialOTP } from "Session/Store/credentialOTP/types";
export const CREDENTIAL_OTP_UPDATED = "CREDENTIAL_OTP_UPDATED";
interface CredentialOTPUpdatedAction extends Action {
  type: typeof CREDENTIAL_OTP_UPDATED;
  credentialId: string;
  otp: CredentialOTP;
}
export const credentialOTPUpdatedAction = (
  credentialId: string,
  otp: CredentialOTP
): CredentialOTPUpdatedAction => ({
  type: CREDENTIAL_OTP_UPDATED,
  credentialId,
  otp,
});
export type CredentialOTPAction = CredentialOTPUpdatedAction;
