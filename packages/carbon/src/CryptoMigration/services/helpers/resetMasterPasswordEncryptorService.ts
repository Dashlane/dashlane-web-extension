import {
  getLegacyCryptoConfig,
  KWC3_DEFAULT_PAYLOAD,
  parsePayload,
} from "Libs/CryptoCenter/transportable-data";
import { CoreServices } from "Services";
import { masterPasswordSelector, serverKeySelector } from "Session/selectors";
export function resetMasterPasswordEncryptorService(
  services: CoreServices,
  cryptoUserPayload: string
) {
  const { storeService, masterPasswordEncryptorService } = services;
  const state = storeService.getState();
  const masterPassword = masterPasswordSelector(state);
  const serverKey = serverKeySelector(state);
  const newUserCryptoConfig =
    cryptoUserPayload === KWC3_DEFAULT_PAYLOAD
      ? getLegacyCryptoConfig(cryptoUserPayload)
      : parsePayload(cryptoUserPayload).cryptoConfig;
  masterPasswordEncryptorService.setInstance(
    { raw: masterPassword },
    serverKey,
    newUserCryptoConfig
  );
}
