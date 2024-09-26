import { deflatedUtf8ToUtf16 } from "Libs/CryptoCenter";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { KeyPair } from "Libs/WS/Backup/types";
import { updateKeyPair } from "Session/Store/session/actions";
import { StoreService } from "Store/index";
export const decipherPrivateKey = async (
  storeService: StoreService,
  dataEncryptorService: DataEncryptorService,
  keyPair: KeyPair
): Promise<string> => {
  const privateKeyBytes = await dataEncryptorService
    .getInstance()
    .decrypt(keyPair.privateKey);
  const privateKey = deflatedUtf8ToUtf16(privateKeyBytes, {
    skipInflate: true,
  });
  const newKeyPair = {
    privateKey,
    publicKey: keyPair.publicKey,
  };
  storeService.dispatch(updateKeyPair(newKeyPair));
  return privateKey;
};
