import {
  MonoBucketOwner,
  PlatformView,
  PreviousDeviceInfo,
} from "@dashlane/communication";
import { toPlatformView } from "./device-info.view-mappers";
export const toPreviousDeviceInfo = ({
  deviceName,
  devicePlatform,
  lastActivityDate,
}: MonoBucketOwner): PreviousDeviceInfo => {
  return {
    name: deviceName ?? "",
    platform: devicePlatform
      ? toPlatformView(devicePlatform)
      : PlatformView.Other,
    lastActive: lastActivityDate,
  };
};
