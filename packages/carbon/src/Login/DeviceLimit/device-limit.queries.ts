import { LoginDeviceLimitFlowView } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type DeviceLimitQueries = {
  getLoginDeviceLimitFlow: Query<void, LoginDeviceLimitFlowView | null>;
};
