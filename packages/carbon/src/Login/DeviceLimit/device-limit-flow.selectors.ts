import { State } from "Store";
import { toLoginDeviceLimitFlowView } from "Login/DeviceLimit/device-limit-flow.view-mappers";
import {
  LoginDeviceLimitFlow,
  LoginDeviceLimitFlowView,
} from "@dashlane/communication";
export const loginDeviceLimitFlowSelector = (
  state: State
): LoginDeviceLimitFlow | null => state.userSession.loginDeviceLimitFlow.flow;
export const viewedLoginDeviceLimitFlowSelector = (
  state: State
): LoginDeviceLimitFlowView | null => {
  const flow = loginDeviceLimitFlowSelector(state);
  if (!flow) {
    return null;
  }
  return toLoginDeviceLimitFlowView(flow);
};
