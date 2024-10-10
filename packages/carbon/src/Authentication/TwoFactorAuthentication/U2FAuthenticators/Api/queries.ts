import { U2FDevice } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type U2FAuthenticatorsQueries = {
  getU2FDevicesList: Query<void, U2FDevice[]>;
};
