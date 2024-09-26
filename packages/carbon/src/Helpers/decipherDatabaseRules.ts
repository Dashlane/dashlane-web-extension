import {
  decipherDashlaneSecureData,
  deflatedUtf8ToUtf16,
} from "Libs/CryptoCenter/index";
import { makeGetDerivateKeyWithCacheAndQueue } from "Libs/CryptoCenter/Helpers/getDerivateKey";
const decrypt = async (password: string, cipheredData: string) => {
  const serverKey = "";
  const bytes = await decipherDashlaneSecureData(
    cipheredData,
    password,
    serverKey,
    makeGetDerivateKeyWithCacheAndQueue()
  );
  return deflatedUtf8ToUtf16(bytes);
};
export const decipherDatabaseRules = (
  password: string,
  data: string
): Promise<string> => decrypt(password, data);
