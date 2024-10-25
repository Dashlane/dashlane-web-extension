import { CredentialOTP } from "Session/Store/credentialOTP/types";
import { CredentialOTPAction } from "Session/Store/credentialOTP/actions";
export type CredentialOTPs = Record<string, CredentialOTP>;
export function credentialOTPs(
  state = {},
  action: CredentialOTPAction
): CredentialOTPs {
  switch (action.type) {
    case "CREDENTIAL_OTP_UPDATED":
      return {
        ...state,
        [action.credentialId]: action.otp,
      };
    default:
      return state;
  }
}
