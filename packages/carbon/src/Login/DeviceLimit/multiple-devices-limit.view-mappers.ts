import {
  DeviceToDeactivateInfo,
  DeviceToDeactivateInfoView,
  PlatformView,
} from "@dashlane/communication";
import { toPlatformView } from "Login/DeviceLimit/device-info.view-mappers";
export const toDeviceToDeactivateInfoView = (
  device: DeviceToDeactivateInfo
): DeviceToDeactivateInfoView => ({
  ...device,
  platform: device.devicePlatform
    ? toPlatformView(device.devicePlatform)
    : PlatformView.Other,
});
