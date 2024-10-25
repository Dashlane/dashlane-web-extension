import { SessionServices } from "User/Services/SessionService";
import { sessionEncryptorKeysSelector } from "Session/selectors";
import { isSSOUserSelector } from "Session/sso.selectors";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { SessionEncryptorKeys } from "Session/Store/session/types";
const noDerivationCryptoConfig = getNoDerivationCryptoConfig();
const emptyServerKey = "";
function setupMasterPasswordEncryptorService(
  services: SessionServices,
  keys: SessionEncryptorKeys,
  isSSOUser: boolean
) {
  const { masterPassword, serverKey } = keys;
  if (!masterPassword) {
    return;
  }
  const [rawKey, rawServerKey, cryptoConfig] = isSSOUser
    ? [masterPassword, emptyServerKey, noDerivationCryptoConfig]
    : [masterPassword, serverKey, undefined];
  services.masterPasswordEncryptorService.setInstance(
    { raw: rawKey },
    rawServerKey,
    cryptoConfig
  );
}
function setupRemoteDataEncryptorService(
  services: SessionServices,
  keys: SessionEncryptorKeys
) {
  const { masterPassword, remoteKey, serverKey } = keys;
  if (!remoteKey && !masterPassword) {
    return;
  }
  const [rawKey, rawServerKey, cryptoConfig] = remoteKey
    ? [remoteKey, emptyServerKey, noDerivationCryptoConfig]
    : [masterPassword, serverKey, undefined];
  services.remoteDataEncryptorService.setInstance(
    {
      raw: rawKey,
    },
    rawServerKey,
    cryptoConfig
  );
}
function setupLocalDataEncryptorService(
  services: SessionServices,
  keys: SessionEncryptorKeys
) {
  const { localKey, masterPassword, serverKey } = keys;
  if (!localKey && !masterPassword) {
    return;
  }
  const [rawKey, rawServerKey, cryptoConfig] = localKey
    ? [localKey, emptyServerKey, noDerivationCryptoConfig]
    : [masterPassword, serverKey, undefined];
  services.localDataEncryptorService.setInstance(
    {
      raw: rawKey,
    },
    rawServerKey,
    cryptoConfig
  );
}
export function setupEncryptorServices(services: SessionServices): void {
  const { storeService } = services;
  const state = storeService.getState();
  const keys = sessionEncryptorKeysSelector(state);
  const isSSOUser = isSSOUserSelector(state);
  setupMasterPasswordEncryptorService(services, keys, isSSOUser);
  setupRemoteDataEncryptorService(services, keys);
  setupLocalDataEncryptorService(services, keys);
}
