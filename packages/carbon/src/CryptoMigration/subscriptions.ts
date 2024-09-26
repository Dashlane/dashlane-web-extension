import { CoreServices } from "Services/index";
import { EventBusService } from "EventBus";
import { migrateUserCrypto } from "./services/migrateUserCrypto";
import { CryptoMigrationType } from "@dashlane/hermes";
import { teamCryptoForcedPayloadSelector } from "./selectors";
import {
  ARGON2_DEFAULT_PAYLOAD,
  CryptoPayload,
  KWC3_DEFAULT_PAYLOAD,
} from "Libs/CryptoCenter/transportable-data";
import { userDefaultCryptoSelector } from "Session/selectors";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  eventBus.carbonSessionOpened.on(() => {
    const { storeService } = services;
    const state = storeService.getState();
    const teamEnforcedCryptoPayload = teamCryptoForcedPayloadSelector(state);
    const cryptoUserPayload = userDefaultCryptoSelector(state) as CryptoPayload;
    if (
      !teamEnforcedCryptoPayload &&
      cryptoUserPayload === KWC3_DEFAULT_PAYLOAD
    ) {
      migrateUserCrypto(
        services,
        KWC3_DEFAULT_PAYLOAD,
        ARGON2_DEFAULT_PAYLOAD,
        CryptoMigrationType.MigrateLegacy
      );
      return;
    }
    if (
      !!teamEnforcedCryptoPayload &&
      teamEnforcedCryptoPayload !== cryptoUserPayload
    ) {
      migrateUserCrypto(
        services,
        cryptoUserPayload,
        teamEnforcedCryptoPayload,
        CryptoMigrationType.TeamEnforced
      );
      return;
    }
  });
}
