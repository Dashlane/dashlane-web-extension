import { Match } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { Breach } from "DataManagement/Breaches/types";
type Getters = ((b: Breach) => string)[];
export const searchGetters: Getters = [];
export type BreachMatch = Match<Breach>;
export const breachMatch: BreachMatch = match(searchGetters);
