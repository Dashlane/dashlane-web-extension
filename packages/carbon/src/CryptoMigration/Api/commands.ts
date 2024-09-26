import {
  ChangeUserCryptoParams,
  ChangeUserCryptoResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type CryptoMigrationCommands = {
  changeUserCrypto: Command<ChangeUserCryptoParams, ChangeUserCryptoResult>;
};
