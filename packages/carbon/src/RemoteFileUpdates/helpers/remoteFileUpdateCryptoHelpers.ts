import { UpdateAvailableFileMetaData } from "@dashlane/communication";
import {
  decipherDashlaneSecureData,
  deflatedUtf8ToUtf16,
} from "Libs/CryptoCenter";
import { makeGetDerivateKeyWithCacheAndQueue } from "Libs/CryptoCenter/Helpers/getDerivateKey";
import { bufferToBase64, str2ab } from "Libs/CryptoCenter/Helpers/Helper";
import { HashAlgorithm } from "Libs/CryptoCenter/Primitives/AsymmetricEncryption";
import {
  AsymmetricEncryption,
  makeAsymmetricEncryption,
} from "Libs/CryptoCenter/SharingCryptoService";
import {
  REMOTE_FILE_KEY_DEV,
  REMOTE_FILE_KEY_PROD,
  RemoteFilePublicKey,
} from "RemoteFileUpdates/constants";
import { RemoteFileError } from "RemoteFileUpdates/remoteFileErrors";
import { RemoteFileUpdateError } from "@dashlane/hermes";
const base64 = require("base-64");
const REMOTE_FILE_S3_ENDPOINT = "__REDACTED__" as const;
const isProdFile = (s3URL: string): boolean =>
  s3URL.startsWith(REMOTE_FILE_S3_ENDPOINT + "prod/");
const isDevFile = (s3URL: string): boolean =>
  s3URL.startsWith(REMOTE_FILE_S3_ENDPOINT + "dev/");
export const computePublicKeyForSignature = (
  s3URL: string
): RemoteFilePublicKey => {
  if (isProdFile(s3URL)) {
    return REMOTE_FILE_KEY_PROD;
  } else if (isDevFile(s3URL)) {
    return REMOTE_FILE_KEY_DEV;
  } else {
    throw new RemoteFileError(
      RemoteFileUpdateError.DecipherError,
      `__REDACTED__`
    );
  }
};
export async function decipherDecryptionKey(
  decryptionKey: string,
  userPrivateKey: string
): Promise<string> {
  const sha1Crypto = makeAsymmetricEncryption({
    hashAlgorithm: HashAlgorithm.SHA_1,
  });
  try {
    return base64.decode(
      await sha1Crypto.decrypt(userPrivateKey, decryptionKey)
    );
  } catch (e) {
    throw new RemoteFileError(
      RemoteFileUpdateError.DecipherError,
      "Invalid encryption on deciphering key"
    );
  }
}
export async function verifyRemoteFileSignature(
  sha256Crypto: AsymmetricEncryption,
  { signature, url }: UpdateAvailableFileMetaData,
  fileContentBase64: string
): Promise<boolean> {
  const remoteFilePublicKey = computePublicKeyForSignature(url);
  return await sha256Crypto.verify(
    remoteFilePublicKey,
    signature,
    fileContentBase64
  );
}
export async function decipherFileIntoBlob(
  cipheredFileBase64Format: string,
  decipheringKey: string
): Promise<ArrayBuffer> {
  try {
    return str2ab(
      deflatedUtf8ToUtf16(
        await decipherDashlaneSecureData(
          cipheredFileBase64Format,
          decipheringKey,
          "",
          makeGetDerivateKeyWithCacheAndQueue()
        ),
        { skipInflate: true }
      )
    );
  } catch (e) {
    throw new RemoteFileError(
      RemoteFileUpdateError.DecipherError,
      "Invalid encryption on file"
    );
  }
}
export async function decipherRemoteFileUpdate(
  cipheredFileContent: ArrayBuffer,
  fileMetaData: UpdateAvailableFileMetaData,
  userPrivateKey: string
): Promise<ArrayBuffer> {
  const fileContentBase64 = bufferToBase64(cipheredFileContent);
  const decipheredAesKey = await decipherDecryptionKey(
    fileMetaData.key,
    userPrivateKey
  );
  const sha256Crypto = makeAsymmetricEncryption({
    hashAlgorithm: HashAlgorithm.SHA_256,
  });
  const isSignatureValid = await verifyRemoteFileSignature(
    sha256Crypto,
    fileMetaData,
    fileContentBase64
  );
  if (!isSignatureValid) {
    throw new RemoteFileError(
      RemoteFileUpdateError.DecipherError,
      `Invalid signature detected on file`
    );
  }
  return await decipherFileIntoBlob(fileContentBase64, decipheredAesKey);
}
