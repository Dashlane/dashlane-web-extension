import { partition, unnest } from "ramda";
import {
  DevicesInfo,
  LimitedDeviceInfo,
  OneDeviceLimitStatus,
  PairingGroupInfo,
  PremiumStatus,
} from "@dashlane/communication";
import {
  findMyPairingGroup,
  getPairingGroupDevices,
  isDesktopPlatform,
  isDevicePartOfPairingGroup,
} from "Login/DeviceLimit/device-info.domain";
import {
  limitedToOneDevice,
  notLimitedToOneDevice,
} from "Login/DeviceLimit/one-device-limit.factories";
export function isOneDeviceLimitApplicable(
  pairingId: string | null,
  devicesInfo: DevicesInfo,
  deviceId: string,
  premiumStatus: PremiumStatus
): OneDeviceLimitStatus {
  const { bucketOwner, bucketOwnerPairingGroup } =
    getMonoBucketOwner(devicesInfo);
  const { pairingGroups } = devicesInfo;
  const hasOneDeviceLimitCapability = Boolean(
    premiumStatus?.capabilities?.devicesLimit?.info?.limit === 1
  );
  if (!hasOneDeviceLimitCapability) {
    return notLimitedToOneDevice();
  }
  const bucketOwnerIsPairedPairingGroup =
    bucketOwnerPairingGroup && pairingId
      ? bucketOwnerPairingGroup.pairingGroupUUID === pairingId
      : false;
  const myPairingGroup = findMyPairingGroup(pairingGroups, pairingId ?? "");
  const bucketOwnerIsInPairedPairingGroup =
    bucketOwner && myPairingGroup
      ? isDevicePartOfPairingGroup(bucketOwner, myPairingGroup)
      : false;
  if (
    bucketOwner &&
    bucketOwner.deviceId !== deviceId &&
    !bucketOwnerIsPairedPairingGroup &&
    !bucketOwnerIsInPairedPairingGroup
  ) {
    return limitedToOneDevice(bucketOwner);
  }
  return notLimitedToOneDevice();
}
export function getMonoBucketOwner(devicesInfo: DevicesInfo): {
  bucketOwner: LimitedDeviceInfo | null;
  bucketOwnerPairingGroup: PairingGroupInfo | null;
} {
  const { devices, pairingGroups } = devicesInfo;
  let bucketOwnerPairingGroup: PairingGroupInfo | null = null;
  let bucketOwner: LimitedDeviceInfo | null =
    devices.find((device) => device.isBucketOwner) ?? null;
  if (!bucketOwner) {
    bucketOwnerPairingGroup =
      pairingGroups.find((pairingGroup) => pairingGroup.isBucketOwner) ?? null;
    if (bucketOwnerPairingGroup) {
      const pairingGroupDevices = getPairingGroupDevices(
        bucketOwnerPairingGroup,
        devices
      );
      const cmpDeviceLastUpdate = (
        l: LimitedDeviceInfo,
        r: LimitedDeviceInfo
      ) => l.lastActivityDate - r.lastActivityDate;
      pairingGroupDevices.sort(cmpDeviceLastUpdate);
      const isDesktopDevice = (d: LimitedDeviceInfo) =>
        Boolean(d.devicePlatform && isDesktopPlatform(d.devicePlatform));
      const partitions = partition(isDesktopDevice, pairingGroupDevices);
      const prioritizedDevices = unnest(partitions);
      bucketOwner = prioritizedDevices[0] || null;
    }
  }
  return {
    bucketOwner,
    bucketOwnerPairingGroup,
  };
}
