import { ChangeMasterPasswordProgress } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type ChangeMasterPasswordLiveQueries = {
  liveChangeMasterPasswordStatus: LiveQuery<void, ChangeMasterPasswordProgress>;
};
