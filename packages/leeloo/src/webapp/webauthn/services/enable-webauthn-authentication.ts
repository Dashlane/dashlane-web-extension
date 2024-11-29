import {
  InitEnableWebAuthnAuthenticationResult,
  WebAuthnCallTypes,
} from "@dashlane/communication";
import { EnableWebAuthnAuthenticationResult } from "./types";
import { enableWebAuthnAuthenticationWithAssertion } from "./enable-webauthn-authentication-with-assertion";
import { enableWebAuthnAuthenticationWithAttestation } from "./enable-webauthn-authentication-with-attestation";
export const enableWebAuthnAuthentication = async (
  initEnableResult: InitEnableWebAuthnAuthenticationResult | undefined
) => {
  if (!initEnableResult || !initEnableResult.success) {
    throw new Error("WebAuthn authentication - Init Enable Result missing");
  }
  const { publicKeyOptions, webAuthnType } = initEnableResult.response;
  let enableResult: EnableWebAuthnAuthenticationResult;
  switch (webAuthnType) {
    case WebAuthnCallTypes.CREATE:
      enableResult = await enableWebAuthnAuthenticationWithAttestation(
        publicKeyOptions
      );
      break;
    case WebAuthnCallTypes.GET:
      enableResult = await enableWebAuthnAuthenticationWithAssertion(
        publicKeyOptions
      );
      break;
    default:
      enableResult = {
        success: false,
      };
  }
  if (!enableResult.success) {
    throw new Error("WebAuthn authentication - Enable call on Carbon failed");
  }
  return enableResult;
};
