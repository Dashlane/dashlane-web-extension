import {
  AssertionCredentialJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import {
  arrayBufferToBase64Url,
  base64UrlToArrayBuffer,
} from "@dashlane/framework-encoding";
async function createAssertionAuthenticator(
  publicKeyJSON: PublicKeyCredentialRequestOptionsJSON
) {
  const publicKey: PublicKeyCredentialRequestOptions = {
    challenge: base64UrlToArrayBuffer(publicKeyJSON.challenge),
    userVerification: publicKeyJSON.userVerification,
    rpId: publicKeyJSON.rpId,
    timeout: publicKeyJSON.timeout,
    allowCredentials: (publicKeyJSON.allowCredentials ?? []).map((cred) => ({
      id: base64UrlToArrayBuffer(cred.id),
      type: cred.type,
    })),
  };
  const credential = await navigator.credentials.get({ publicKey });
  if (!credential) {
    throw new Error(
      "Passwordless assertion could not be completed as credential cannot be created"
    );
  }
  return credential as PublicKeyCredential & {
    type: PublicKeyCredentialType;
  };
}
export async function startAssertion(
  publicKey: PublicKeyCredentialRequestOptionsJSON
): Promise<AssertionCredentialJSON> {
  const credential = await createAssertionAuthenticator(publicKey);
  const credentialResponse =
    credential.response as AuthenticatorAssertionResponse;
  const credentialJSON: AssertionCredentialJSON = {
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
    authenticatorAttachment: "platform",
  };
  return credentialJSON;
}
