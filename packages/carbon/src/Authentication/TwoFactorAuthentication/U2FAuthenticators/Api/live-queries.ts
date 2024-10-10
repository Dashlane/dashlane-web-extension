import { U2FDevice } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type U2FAuthenticatorsLiveQueries = {
  liveU2FDevicesList: LiveQuery<void, U2FDevice[]>;
};
