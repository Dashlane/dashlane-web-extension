import { Match, Passkey } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
export const searchGetters: ((b: Passkey) => string)[] = [
  stringProp<Passkey>("RpId"),
  stringProp<Passkey>("RpName"),
  stringProp<Passkey>("CredentialId"),
];
export type PasskeyMatch = Match<Passkey>;
export const passkeyMatch: PasskeyMatch = match(searchGetters);
