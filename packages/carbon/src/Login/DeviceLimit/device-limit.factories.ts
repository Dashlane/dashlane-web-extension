import {
  DeviceToDeactivateInfo,
  LimitedToMultipleDevices,
  LimitedToOneDevice,
  MonoBucketOwner,
  NoDeviceLimit,
} from "@dashlane/communication";
export const limitedToOneDevice = (
  bucketOwner: MonoBucketOwner
): LimitedToOneDevice => ({
  _tag: "limitedToOneDevice",
  bucketOwner,
});
export const limitedToMultipleDevices = (
  devices: DeviceToDeactivateInfo[]
): LimitedToMultipleDevices => ({
  _tag: "limitedToMultipleDevices",
  devices,
});
export const noDeviceLimit = (): NoDeviceLimit => ({
  _tag: "noDeviceLimit",
});
