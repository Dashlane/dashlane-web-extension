import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { changeMPDone } from "Session/Store/changeMasterPassword/actions";
import {
  updateMasterPassword,
  updateServerKey,
} from "Session/Store/session/actions";
import { CoreServices } from "Services";
export const revertOnError = async (
  services: CoreServices,
  dataEncryptorService: DataEncryptorService,
  params: {
    currentPassword: string;
    serverKey: string;
  }
): Promise<void> => {
  const { currentPassword, serverKey } = params;
  const { storeService } = services;
  dataEncryptorService.setInstance({ raw: currentPassword }, serverKey);
  storeService.dispatch(updateMasterPassword(currentPassword));
  storeService.dispatch(updateServerKey(serverKey));
  storeService.dispatch(changeMPDone());
};
