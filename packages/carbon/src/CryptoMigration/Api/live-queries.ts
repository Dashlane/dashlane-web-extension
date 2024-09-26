import { SupportedDerivationMethods } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type CryptoMigrationLiveQueries = {
  liveUserDerivationMethod: LiveQuery<void, SupportedDerivationMethods>;
};
