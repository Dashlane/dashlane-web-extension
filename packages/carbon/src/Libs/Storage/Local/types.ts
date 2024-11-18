import { StorageService } from "Libs/Storage/types";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { StoreService } from "Store/index";
import { UserLocalDataService } from "Libs/Storage/User/index";
export interface LocalStorageService {
  setInstance: (login: string) => void;
  getInstance: () => UserLocalDataService;
}
export interface UserLocalDataServices {
  storageService: StorageService;
  masterPasswordEncryptorService: DataEncryptorService;
  localDataEncryptorService: DataEncryptorService;
  authorizationKeysEncryptorService: DataEncryptorService;
  autoLoginEncryptorService: DataEncryptorService;
  webAuthnAuthenticationEncryptorService: DataEncryptorService;
  storeService: StoreService;
}
