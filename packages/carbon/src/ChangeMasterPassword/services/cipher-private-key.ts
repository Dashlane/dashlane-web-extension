import { utf16ToDeflatedUtf8 } from "Libs/CryptoCenter";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
export const cipherPrivateKey = async (
  dataEncryptorService: DataEncryptorService,
  privateKey: string
): Promise<string> => {
  const privateKeyBytes = utf16ToDeflatedUtf8(privateKey, {
    skipDeflate: true,
  });
  return await dataEncryptorService.getInstance().encrypt(privateKeyBytes);
};
