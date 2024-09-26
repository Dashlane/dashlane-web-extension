import { BlacklistedSliceKeys } from "Store/types";
import { DeviceState } from "Device/types";
export const blacklistedDeviceKeys: BlacklistedSliceKeys<DeviceState> = [
  "remoteFile",
];
