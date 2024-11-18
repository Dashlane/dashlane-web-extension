import {
  LimitedDeviceInfo,
  PairingGroupInfo,
  Platform,
} from "@dashlane/communication";
export const isDesktopPlatform = (platform: Platform) =>
  platform === Platform.DesktopLegacyWindows ||
  platform === Platform.DesktopLegacyMacOS ||
  platform === Platform.DesktopUWP;
export const isDevicePartOfPairingGroup = (
  deviceInfo: LimitedDeviceInfo,
  pairingGroup: PairingGroupInfo
): boolean => {
  return pairingGroup.devices.includes(deviceInfo.deviceId);
};
export const findMyPairingGroup = (
  pairingGroups: PairingGroupInfo[],
  pairingId: string
): PairingGroupInfo | undefined => {
  return pairingGroups.find(
    (pairingGroup) => pairingGroup.pairingGroupUUID === pairingId
  );
};
export const getPairingGroupDevices = (
  pairingGroup: PairingGroupInfo,
  allDevices: LimitedDeviceInfo[]
): LimitedDeviceInfo[] => {
  return allDevices.filter(({ deviceId }) =>
    pairingGroup.devices.includes(deviceId)
  );
};
