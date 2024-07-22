import { Space } from "@dashlane/communication";
import { isTypeArray } from "./is-type-array";
export const isSpaceArray = (uut: unknown): uut is Space[] =>
  isTypeArray(uut, ["teamId"]);
