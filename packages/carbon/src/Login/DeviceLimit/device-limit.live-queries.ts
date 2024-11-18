import { LoginDeviceLimitFlowView } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type DeviceLimitLiveQueries = {
  liveLoginDeviceLimitFlow: LiveQuery<void, LoginDeviceLimitFlowView | null>;
};
