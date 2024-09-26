import {
  base64ToBuffer,
  bufferToBase64,
  concatBuffers,
} from "Libs/CryptoCenter/Helpers/Helper";
import { hashAndSplitKey } from "Libs/CryptoCenter/Primitives/Hash";
import {
  decryptAES256,
  signHashHmacSHA256,
} from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import {
  isDashlaneSecureDataFlexible,
  isNoDerivation,
  parseCipheredData,
} from "Libs/CryptoCenter/transportable-data";
export const decipherSecureFileContent = async (
  data: Uint8Array,
  cryptoKey: string
) => {
  const dashlaneSecureData = parseCipheredData(data);
  const cryptoConfig = dashlaneSecureData.cryptoConfig;
  if (
    !isDashlaneSecureDataFlexible(dashlaneSecureData) ||
    !isNoDerivation(cryptoConfig.derivation)
  ) {
    return null;
  }
  const keys = await hashAndSplitKey(base64ToBuffer(cryptoKey));
  const hash = await signHashHmacSHA256({
    key: keys.hmac,
    data: concatBuffers(
      dashlaneSecureData.iv,
      dashlaneSecureData.cipheredContent
    ),
  });
  if (bufferToBase64(hash) !== bufferToBase64(dashlaneSecureData.hash)) {
    return null;
  }
  const buffer = await decryptAES256({
    key: keys.aes,
    iv: dashlaneSecureData.iv,
    encryptedData: dashlaneSecureData.cipheredContent,
  });
  return buffer;
};
