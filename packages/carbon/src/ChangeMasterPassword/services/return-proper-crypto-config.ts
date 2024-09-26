import { ARGON2_DEFAULT_PAYLOAD } from "Libs/CryptoCenter";
import {
  makeFlexibleMarkerCryptoConfig,
  parsePayload,
} from "Libs/CryptoCenter/transportable-data";
import { StoreService } from "Store/index";
import { currentSpaceInfoSelector } from "TeamAdmin/Services/selectors";
export const returnProperCryptoConfig = (storeService: StoreService) => {
  let CryptoUserPayload = ARGON2_DEFAULT_PAYLOAD;
  const spaceInfo = currentSpaceInfoSelector(storeService.getState());
  if (spaceInfo?.cryptoForcedPayload) {
    CryptoUserPayload = spaceInfo.cryptoForcedPayload;
  }
  try {
    return parsePayload(CryptoUserPayload).cryptoConfig;
  } catch (error) {
    return makeFlexibleMarkerCryptoConfig("argon2d");
  }
};
