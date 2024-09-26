export enum Platform {
  Android,
  CarbonTests,
  CarbonUnknown,
  DesktopLegacyMacOS,
  DesktopLegacyWindows,
  DesktopUWP,
  IPad,
  IPhone,
  IPod,
  StandaloneExtension,
  TeamAdminConsole,
  WebApp,
  WebAppDev,
}
export interface LimitedDeviceInfo {
  deviceId: string;
  deviceName: null | string;
  devicePlatform: null | Platform;
  lastActivityDate: number;
  isBucketOwner: boolean;
  temporary: boolean;
}
export interface PairingGroupInfo {
  pairingGroupUUID: string;
  devices: Array<string>;
  isBucketOwner?: boolean;
}
export interface DevicesInfo {
  devices: LimitedDeviceInfo[];
  pairingGroups: PairingGroupInfo[];
}
