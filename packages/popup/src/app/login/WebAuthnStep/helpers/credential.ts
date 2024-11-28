import {
  AssertionCredentialJSONCustom,
  PublicKeyCredentialRequestOptionsJSON,
} from "@dashlane/communication";
import {
  arrayBufferToBase64Url,
  base64UrlToArrayBuffer,
} from "@dashlane/framework-encoding";
async function createAssertionAuthenticator(
  publicKeyJSON: PublicKeyCredentialRequestOptionsJSON,
  authAbortSignal: AbortSignal
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
  authAbortSignal: AbortSignal
): Promise<AssertionCredentialJSONCustom> {
  const credential = await createAssertionAuthenticator(
    publicKey,
    authAbortSignal
  );
  const credentialResponse =
    credential.response as AuthenticatorAssertionResponse;
  const credentialJSON: AssertionCredentialJSONCustom = {
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
  return credentialJSON;
}
