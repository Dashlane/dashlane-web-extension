import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  ActivateVpnAccountRequest,
  VpnAccountStatus,
  VpnCapabilitySetting,
} from "./types";
export const vpnQueriesSlots = {
  getVpnAccount: slot<void, VpnAccountStatus>(),
  getVpnCapabilitySetting: slot<void, VpnCapabilitySetting>(),
};
export const vpnLiveQueriesSlots = {
  liveVpnAccount: liveSlot<VpnAccountStatus>(),
};
export const vpnCommandsSlots = {
  activateVpnAccount: slot<ActivateVpnAccountRequest, void>(),
  clearVpnAccountErrors: slot<void, void>(),
  completeVpnAccountActivation: slot<void, void>(),
};
