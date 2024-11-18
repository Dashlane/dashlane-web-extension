import {
  DeviceToDeactivateInfo,
  LimitedToMultipleDevices,
  NotLimitedToMultipleDevices,
} from "@dashlane/communication";
export const notLimitedToMultipleDevices = (): NotLimitedToMultipleDevices => ({
  _tag: "notLimitedToMultipleDevices",
});
export const limitedToMultipleDevices = (
  devices: DeviceToDeactivateInfo[]
): LimitedToMultipleDevices => ({
  _tag: "limitedToMultipleDevices",
  devices,
});
