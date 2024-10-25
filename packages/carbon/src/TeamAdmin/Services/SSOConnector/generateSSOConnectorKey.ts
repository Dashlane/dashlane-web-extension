import { bufferToBase64 } from "Libs/CryptoCenter/Helpers/Helper";
import { generate64BytesKey } from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import { v4 as uuidv4 } from "uuid";
export async function generateSSOConnectorKey(): Promise<string> {
  const key = await generate64BytesKey();
  const keyInBase64 = bufferToBase64(key);
  return `${uuidv4()}|${keyInBase64}`;
}
