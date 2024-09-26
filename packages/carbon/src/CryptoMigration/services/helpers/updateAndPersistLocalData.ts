import { CryptoMigrationStatus } from "@dashlane/hermes";
import { bufferToBase64 } from "Libs/CryptoCenter/Helpers/Helper";
import { getRandomValues } from "Libs/CryptoCenter/Helpers/WebCryptoWrapper";
import { CryptoPayload } from "Libs/CryptoCenter/transportable-data";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { editPersonalSettings } from "Session/Store/personalSettings/actions";
import { StoreService } from "Store";
import { SessionService } from "User/Services/types";
export async function updateAndPersistLocalData(
  storeService: StoreService,
  sessionService: SessionService,
  localStorageService: LocalStorageService,
  newCryptoPayload: CryptoPayload,
  logCryptoMigrationEvent: (status: CryptoMigrationStatus) => void
): Promise<void> {
  try {
    storeService.dispatch(
      editPersonalSettings({
        CryptoUserPayload: newCryptoPayload,
        CryptoFixedSalt: bufferToBase64(getRandomValues(16)),
      })
    );
    await sessionService.getInstance().user.persistPersonalSettings();
    const localKeyRawClear = await localStorageService
      .getInstance()
      .getLocalKey();
    await sessionService.getInstance().user.persistLocalKey(localKeyRawClear);
  } catch (error) {
    logCryptoMigrationEvent(CryptoMigrationStatus.ErrorUpdateLocalData);
    throw new Error(`updateAndPersistLocalData failed with error: ${error}`);
  }
}
