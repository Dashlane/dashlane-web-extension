import { bufferToBase64 } from "Libs/CryptoCenter/Helpers/Helper";
import { getRandomValues } from "Libs/CryptoCenter/Helpers/WebCryptoWrapper";
const KEY_LENGTH = 32;
export const generateSCIMSignatureKey = async (): Promise<string> => {
  const buffer = await getRandomValues(KEY_LENGTH);
  return bufferToBase64(buffer);
};
