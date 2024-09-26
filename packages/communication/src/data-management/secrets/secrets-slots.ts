import { ListResults, liveSlot } from "../../CarbonApi";
import { SecretItemView } from "./types";
export const secretLiveQueriesSlots = {
  liveSecrets: liveSlot<ListResults<SecretItemView>>(),
};
