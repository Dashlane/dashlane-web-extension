import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  ChangeUserCryptoParams,
  ChangeUserCryptoResult,
  SupportedDerivationMethods,
} from "./types";
export const cryptoMigrationCommandsSlots = {
  changeUserCrypto: slot<ChangeUserCryptoParams, ChangeUserCryptoResult>(),
};
export const cryptoMigrationQueriesSlots = {
  getCanUserChangeCrypto: slot<void, boolean>(),
  getUserDerivationMethod: slot<void, SupportedDerivationMethods>(),
};
export const cryptoMigrationLiveQueriesSlots = {
  liveUserDerivationMethod: liveSlot<SupportedDerivationMethods>(),
};
