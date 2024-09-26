import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import { LoginDeviceLimitFlowView } from "./device-limit-flow.views";
export const deviceLimitSlots = {
  getLoginDeviceLimitFlow: slot<void, LoginDeviceLimitFlowView | null>(),
};
export const deviceLimitLiveSlots = {
  liveLoginDeviceLimitFlow: liveSlot<LoginDeviceLimitFlowView | null>(),
};
