import { SupportedDerivationMethods } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type CryptoMigrationQueries = {
  getCanUserChangeCrypto: Query<void, boolean>;
  getUserDerivationMethod: Query<void, SupportedDerivationMethods>;
};
