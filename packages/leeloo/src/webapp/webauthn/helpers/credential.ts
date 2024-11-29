import {
  AssertionCredentialJSONCustom,
  AttestationCredentialJSONCustom,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@dashlane/communication";
import {
  arrayBufferToBase64Url,
  base64UrlToArrayBuffer,
} from "@dashlane/framework-encoding";
import { toUint8Array } from "./toUint8Array";
const createAuthenticator = async (
  publicKeyJSON: PublicKeyCredentialCreationOptionsJSON
) => {
  const publicKey: PublicKeyCredentialCreationOptions = {
    rp: publicKeyJSON.rp,
    user: {
      ...publicKeyJSON.user,
      id: toUint8Array(publicKeyJSON.user.id),
    },
    challenge: base64UrlToArrayBuffer(publicKeyJSON.challenge),
    timeout: publicKeyJSON.timeout,
    pubKeyCredParams: publicKeyJSON.pubKeyCredParams,
    authenticatorSelection: publicKeyJSON.authenticatorSelection,
    excludeCredentials: (publicKeyJSON.excludeCredentials ?? []).map(
      (credential) => ({
        id: base64UrlToArrayBuffer(credential.id),
        type: credential.type,
      })
    ),
  };
  const crendential = await navigator.credentials.create({ publicKey });
  if (!crendential) {
    throw new Error(
      "WebAuthn attestation could not be completed as credential cannot be created"
    );
  }
  return crendential as PublicKeyCredential & {
    type: PublicKeyCredentialType;
  };
};
export const startAttestation = async (
  publicKey: PublicKeyCredentialCreationOptionsJSON
): Promise<AttestationCredentialJSONCustom> => {
  const credential = await createAuthenticator(publicKey);
  const credentialsResponse =
    credential.response as AuthenticatorAttestationResponse;
  const credentialJSON: AttestationCredentialJSONCustom = {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferToBase64Url(credential.rawId),
    response: {
      clientDataJSON: arrayBufferToBase64Url(
        credentialsResponse.clientDataJSON
      ),
      attestationObject: arrayBufferToBase64Url(
        credentialsResponse.attestationObject
      ),
    },
  };
  if (typeof credentialsResponse.getTransports === "function") {
    credentialJSON.transports =
      credentialsResponse.getTransports() as AuthenticatorTransport[];
  }
  return credentialJSON;
};
async function createAssertionAuthenticator(
  publicKeyJSON: PublicKeyCredentialRequestOptionsJSON,
  authAbortSignal?: AbortSignal
) {
  const publicKey: PublicKeyCredentialRequestOptions = {
    challenge: base64UrlToArrayBuffer(publicKeyJSON.challenge),
    allowCredentials: (publicKeyJSON.allowCredentials ?? []).map(
      (credential) => ({
        id: base64UrlToArrayBuffer(credential.id),
        type: credential.type,
      })
    ),
    userVerification: publicKeyJSON.userVerification,
    rpId: publicKeyJSON.rpId,
    timeout: publicKeyJSON.timeout,
  };
  const credential = await navigator.credentials.get({
    publicKey,
    signal: authAbortSignal,
  });
  if (!credential) {
    throw new Error(
      "WebAuthn assertion could not be completed as credential cannot be created"
    );
  }
  return credential as PublicKeyCredential & {
    type: PublicKeyCredentialType;
  };
}
export async function startAssertion(
  publicKey: PublicKeyCredentialRequestOptionsJSON,
  authAbortSignal?: AbortSignal
): Promise<AssertionCredentialJSONCustom> {
  const credential = await createAssertionAuthenticator(
    publicKey,
    authAbortSignal
  );
  const credentialResponse =
    credential.response as AuthenticatorAssertionResponse;
  return {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferToBase64Url(credential.rawId),
    response: {
      authenticatorData: arrayBufferToBase64Url(
        credentialResponse.authenticatorData
      ),
      clientDataJSON: arrayBufferToBase64Url(credentialResponse.clientDataJSON),
      signature: arrayBufferToBase64Url(credentialResponse.signature),
    },
    clientExtensionResults: credential.getClientExtensionResults(),
  };
}
