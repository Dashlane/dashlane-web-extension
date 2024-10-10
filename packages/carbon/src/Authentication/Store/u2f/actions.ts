import { U2FDevice } from "@dashlane/communication";
import { Action } from "Store";
export const U2F_DEVICES_UPDATED = "U2F_DEVICES_UPDATED";
export interface U2FDevicesUpdatedAction extends Action {
  type: typeof U2F_DEVICES_UPDATED;
  devices: U2FDevice[];
}
export type U2FAuthenticationAction = U2FDevicesUpdatedAction;
export const u2fDevicesUpdated = (
  devices: U2FDevice[]
): U2FDevicesUpdatedAction => ({
  type: U2F_DEVICES_UPDATED,
  devices,
});
