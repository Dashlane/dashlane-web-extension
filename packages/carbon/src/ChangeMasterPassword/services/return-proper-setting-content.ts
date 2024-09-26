import { PersonalSettings } from "@dashlane/communication";
import type { ClearTransaction } from "Libs/Backup/Transactions/types";
import { ARGON2_DEFAULT_PAYLOAD } from "Libs/CryptoCenter";
import { EncryptOptions } from "Libs/CryptoCenter/types";
import { bufferToBase64 } from "Libs/CryptoCenter/Helpers/Helper";
import { makeBasePersonalSettings } from "Session/Store/personalSettings";
import { StoreService } from "Store/index";
import { currentSpaceInfoSelector } from "TeamAdmin/Services/selectors";
export const returnProperSettingContent = (
  storeService: StoreService,
  transaction: ClearTransaction,
  encryptOptions: EncryptOptions
): PersonalSettings => {
  let CryptoUserPayload = ARGON2_DEFAULT_PAYLOAD;
  const spaceInfo = currentSpaceInfoSelector(storeService.getState());
  if (spaceInfo?.cryptoForcedPayload) {
    CryptoUserPayload = spaceInfo.cryptoForcedPayload;
  }
  return {
    ...makeBasePersonalSettings(),
    ...transaction.content,
    CryptoUserPayload,
    CryptoFixedSalt: bufferToBase64(encryptOptions.forceSalt),
  };
};
