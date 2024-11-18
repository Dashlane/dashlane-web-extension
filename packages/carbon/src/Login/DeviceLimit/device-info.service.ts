import { invertObj } from "ramda";
import { StoreService } from "Store";
import * as DashlaneApi from "Libs/DashlaneApi";
import {
  DevicesInfo,
  LimitedDeviceInfo,
  PairingGroupInfo,
  Platform,
} from "@dashlane/communication";
export interface DeviceInfoService {
  getDevicesInfo: (login: string) => Promise<DevicesInfo>;
}
const FROM_PLATFORM_STRING_INVERTED_MAP: Record<Platform, string> = {
  [Platform.Android]: "server_android",
  [Platform.CarbonTests]: "server_carbon_tests",
  [Platform.CarbonUnknown]: "server_carbon_unknown",
  [Platform.DesktopLegacyMacOS]: "server_macosx",
  [Platform.DesktopLegacyWindows]: "server_win",
  [Platform.DesktopUWP]: "desktop_win",
  [Platform.IPad]: "server_ipad",
  [Platform.IPhone]: "server_iphone",
  [Platform.IPod]: "server_ipod",
  [Platform.StandaloneExtension]: "server_standalone",
  [Platform.TeamAdminConsole]: "server_tac",
  [Platform.WebApp]: "server_leeloo",
  [Platform.WebAppDev]: "server_leeloo_dev",
} as const;
const FROM_PLATFORM_STRING_MAP = invertObj(
  FROM_PLATFORM_STRING_INVERTED_MAP
) as unknown as Record<string, Platform>;
const adaptPlatform = (serverPlatform: string): Platform =>
  FROM_PLATFORM_STRING_MAP[serverPlatform];
const adaptDevice = (
  serverDevice: DashlaneApi.ListDevicesSuccess["devices"][number]
): LimitedDeviceInfo => ({
  deviceId: serverDevice.deviceId,
  deviceName: serverDevice.deviceName,
  devicePlatform: adaptPlatform(serverDevice.devicePlatform),
  lastActivityDate: serverDevice.lastActivityDateUnix,
  isBucketOwner: serverDevice.isBucketOwner,
  temporary: serverDevice.temporary,
});
const adaptPairingGroup = (
  serverPairingGroup: DashlaneApi.ListDevicesSuccess["pairingGroups"][number]
): PairingGroupInfo => ({
  pairingGroupUUID: serverPairingGroup.pairingGroupUUID,
  devices: serverPairingGroup.devices,
  isBucketOwner: serverPairingGroup.isBucketOwner,
});
const getDevicesInfo = async (
  storeService: StoreService,
  login: string
): Promise<DevicesInfo> => {
  const response = await DashlaneApi.listDevices(storeService, login);
  if (DashlaneApi.isApiError(response)) {
    throw new Error(`Failed to get devices: ${response.message}`);
  }
  return {
    devices: response.devices.map(adaptDevice),
    pairingGroups: response.pairingGroups.map(adaptPairingGroup),
  };
};
export const makeDeviceInfoService = (
  storeService: StoreService
): DeviceInfoService => {
  return {
    getDevicesInfo: (login: string) => getDevicesInfo(storeService, login),
  };
};
