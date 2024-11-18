import { WebAuthnKeyAlgorithm } from "@dashlane/communication";
import { base64UrlToArrayBuffer } from "@dashlane/framework-encoding";
import * as cbor from "cbor";
import { BrowserApi } from "../../../../Api/types/browser/browser-api";
import { WebauthnErrorName } from "../../../../Api/types/webauthn";
import { WebauthnSendError } from "./webauthn-common";
const asn1encodeInteger = (value: Uint8Array): Uint8Array => {
  const needsPadding = value[0] > 0x7f;
  const paddingLen = needsPadding ? 1 : 0;
  const headerLen = 2;
  const output = new Uint8Array(value.byteLength + headerLen + paddingLen);
  output[0] = 0x02;
  output[1] = value.byteLength + paddingLen;
  output[2] = 0;
  output.set(value, headerLen + paddingLen);
  return output;
};
const asn1encodeSignature = (signature: Uint8Array): Uint8Array => {
  const pointLength = signature.byteLength / 2;
  const s1 = asn1encodeInteger(signature.slice(0, pointLength));
  const s2 = asn1encodeInteger(signature.slice(pointLength));
  const headerLen = 2;
  const output = new Uint8Array(s1.byteLength + s2.byteLength + headerLen);
  output[0] = 0x30;
  output[1] = s1.byteLength + s2.byteLength;
  output.set(s1, headerLen);
  output.set(s2, headerLen + s1.byteLength);
  return output;
};
export type WebauthnCryptoAlgorithm = {
  coseAlgorithmIdentifier: number;
  generateNewKeyPair: (browserApi: BrowserApi) => Promise<{
    publicKey: JsonWebKey;
    privateKey: JsonWebKey;
  }>;
  encodePublicKey: (publicKey: JsonWebKey) => ArrayBuffer;
  sign: (message: ArrayBuffer, privateKey: JsonWebKey) => Promise<ArrayBuffer>;
};
export const supportedWebauthnAlgorithms: WebauthnCryptoAlgorithm[] = [
  {
    coseAlgorithmIdentifier: WebAuthnKeyAlgorithm.ES256,
    async generateNewKeyPair(browserApi: BrowserApi) {
      const subtleCrypto = browserApi.crypto.subtle;
      const key = await subtleCrypto.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign", "verify"]
      );
      const publicKey = await subtleCrypto.exportKey("jwk", key.publicKey);
      const privateKey = await subtleCrypto.exportKey("jwk", key.privateKey);
      return { publicKey, privateKey };
    },
    encodePublicKey(publicKey) {
      if (publicKey.x === undefined || publicKey.y === undefined) {
        throw new WebauthnSendError(WebauthnErrorName.UnknownError);
      }
      return cbor.encode(
        new Map<number, number | ArrayBuffer>([
          [1, 2],
          [3, -7],
          [-1, 1],
          [-2, base64UrlToArrayBuffer(publicKey.x)],
          [-3, base64UrlToArrayBuffer(publicKey.y)],
        ])
      );
    },
    async sign(message, privateKey) {
      const key = privateKey;
      const importedKey = await crypto.subtle.importKey(
        "jwk",
        key,
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign"]
      );
      const signature = new Uint8Array(
        await crypto.subtle.sign(
          {
            name: "ECDSA",
            hash: "SHA-256",
          },
          importedKey,
          message
        )
      );
      return asn1encodeSignature(signature);
    },
  },
];
export const selectWebauthnCryptoAlgorithm = (
  pubKeyCredParams: PublicKeyCredentialParameters[]
): WebauthnCryptoAlgorithm | undefined => {
  const rpSupportedAlgs = pubKeyCredParams.map((param) => Number(param.alg));
  if (rpSupportedAlgs.length === 0) {
    const defaultRpSupportedAlgs = [-7, -257];
    rpSupportedAlgs.push(...defaultRpSupportedAlgs);
  }
  for (const algorithmId of rpSupportedAlgs) {
    const selectedAlgorithm = supportedWebauthnAlgorithms.find(
      (algorithm) => algorithm.coseAlgorithmIdentifier === algorithmId
    );
    if (selectedAlgorithm) {
      return selectedAlgorithm;
    }
  }
  return undefined;
};
