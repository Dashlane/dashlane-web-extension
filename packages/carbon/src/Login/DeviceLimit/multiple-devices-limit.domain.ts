import {
  DevicesInfo,
  DeviceToDeactivateInfo,
  LimitedDeviceInfo,
  PairingGroupInfo,
  PremiumStatus,
} from "@dashlane/communication";
import {
  limitedToMultipleDevices,
  notLimitedToMultipleDevices,
} from "Login/DeviceLimit/multiple-devices-limit.factories";
import { DeviceKeys } from "Store/helpers/Device";
interface IsMultipleDevicesLimitApplicableSuccess {
  _tag: "limitedToMultipleDevices";
  devices: DeviceToDeactivateInfo[];
}
interface IsMultipleDevicesLimitApplicableFailure {
  _tag: "notLimitedToMultipleDevices";
}
type IsMultipleDevicesLimitApplicableReturn =
  | IsMultipleDevicesLimitApplicableSuccess
  | IsMultipleDevicesLimitApplicableFailure;
const filterPairedDevices = ({ pairingGroups, devices }: DevicesInfo) => {
  const nonPairedDevices = devices.filter((device) => {
    const isPairedDevice = pairingGroups.find((pairingGroup) =>
      pairingGroup.devices.includes(device.deviceId)
    );
    if (!isPairedDevice) {
      return device;
    }
    return false;
  }, []);
  return {
    pairingGroups,
    nonPairedDevices,
  };
};
const sortByLastUsed = (a: LimitedDeviceInfo, b: LimitedDeviceInfo) =>
  b.lastActivityDate - a.lastActivityDate;
const sortAndFormatPairingGroupInfo = ({
  pairingGroups,
  devices,
  nonPairedDevices,
  deviceKeys,
}: {
  pairingGroups: PairingGroupInfo[];
  devices: LimitedDeviceInfo[];
  nonPairedDevices: LimitedDeviceInfo[];
  deviceKeys?: DeviceKeys;
}): DeviceToDeactivateInfo[] => {
  const sortedDevices = [...devices].sort(sortByLastUsed);
  const firstPairedDevices: DeviceToDeactivateInfo[] = [];
  for (const pairingGroup of pairingGroups) {
    let pairingGroupsDevice: DeviceToDeactivateInfo;
    if (pairingGroup.devices.includes(deviceKeys?.accessKey)) {
      pairingGroupsDevice = {
        ...devices.find((device) => device.deviceId === deviceKeys?.accessKey),
        isCurrentDevice: true,
      };
    } else {
      pairingGroupsDevice = sortedDevices.find((device) =>
        pairingGroup.devices.includes(device.deviceId)
      );
    }
    firstPairedDevices.push({
      ...pairingGroupsDevice,
      deviceId: pairingGroup.pairingGroupUUID,
      isPairingGroup: true,
    });
  }
  const nonPairedDevicesMarked = nonPairedDevices.map((device) => {
    if (device.deviceId === deviceKeys?.accessKey) {
      return {
        ...device,
        isCurrentDevice: true,
      };
    }
    return device;
  });
  return [...firstPairedDevices, ...nonPairedDevicesMarked].sort(
    sortByLastUsed
  );
};
export const isMultipleDevicesLimitApplicable = (
  devicesInfo: DevicesInfo,
  premiumStatus: PremiumStatus,
  deviceKeys: DeviceKeys
): IsMultipleDevicesLimitApplicableReturn => {
  if ((premiumStatus?.capabilities?.devicesLimit?.info?.limit || 0) <= 1) {
    return notLimitedToMultipleDevices();
  }
  const { nonPairedDevices, pairingGroups } = filterPairedDevices(devicesInfo);
  if (
    premiumStatus.capabilities.devicesLimit.info.limit <
    nonPairedDevices.length + pairingGroups.length
  ) {
    const sortedDevicesList = sortAndFormatPairingGroupInfo({
      devices: devicesInfo.devices,
      nonPairedDevices,
      pairingGroups,
      deviceKeys,
    });
    return limitedToMultipleDevices(sortedDevicesList);
  }
  return notLimitedToMultipleDevices();
};
