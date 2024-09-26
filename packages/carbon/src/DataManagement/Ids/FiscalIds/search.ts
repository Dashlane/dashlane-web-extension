import { FiscalId, Match } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
export const searchGetters: ((b: FiscalId) => string)[] = [
  stringProp<FiscalId>("FiscalNumber"),
  stringProp<FiscalId>("TeledeclarantNumber"),
];
export type FiscalIdMatch = Match<FiscalId>;
export const fiscalIdMatch: FiscalIdMatch = match(searchGetters);
