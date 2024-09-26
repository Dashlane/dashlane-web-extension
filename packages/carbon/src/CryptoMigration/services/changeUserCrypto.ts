import { CryptoMigrationType } from "@dashlane/hermes";
import {
  ChangeUserCryptoParams,
  ChangeUserCryptoResult,
} from "@dashlane/communication";
import { CryptoPayload } from "Libs/CryptoCenter/transportable-data";
import { CoreServices } from "Services";
import { migrateUserCrypto } from "./migrateUserCrypto";
import { getNewCryptoPayload } from "./helpers/getNewCryptoPayload";
export async function changeUserCrypto(
  services: CoreServices,
  { newDerivationMethod }: ChangeUserCryptoParams
): Promise<ChangeUserCryptoResult> {
  const { storeService } = services;
  const currentPayload = storeService.getPersonalSettings()
    .CryptoUserPayload as CryptoPayload;
  const newCryptoPayload = getNewCryptoPayload(newDerivationMethod);
  if (!newCryptoPayload) {
    throw new Error(
      `[changeUserCrypto] - client sent wrong derivation value (${newDerivationMethod})`
    );
  }
  return await migrateUserCrypto(
    services,
    currentPayload,
    newCryptoPayload,
    CryptoMigrationType.SettingsChange
  );
}
