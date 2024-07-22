export enum ReactivationStatus {
  DISABLED = "DISABLED",
  CLASSIC = "CLASSIC",
  WEBAUTHN = "WEBAUTHN",
}
export enum Platform {
  Android,
  CarbonSimulator,
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
export interface DeviceInfo {
  deviceId: string;
  deviceName: null | string;
  devicePlatform: null | Platform;
  lastActivityDate: number;
  isBucketOwner: boolean;
  temporary: boolean;
}
export interface DeviceToDeactivateInfo extends DeviceInfo {
  isPairingGroup?: boolean;
  isCurrentDevice?: boolean;
}
export interface MonoBucketOwner {
  deviceName: null | string;
  devicePlatform: null | Platform;
  lastActivityDate: number;
}
export interface LimitedToOneDevice {
  _tag: "limitedToOneDevice";
  bucketOwner: MonoBucketOwner;
}
export interface LimitedToMultipleDevices {
  _tag: "limitedToMultipleDevices";
  devices: DeviceToDeactivateInfo[];
}
export interface NoDeviceLimit {
  _tag: "noDeviceLimit";
}
export type DeviceLimitStatus =
  | LimitedToOneDevice
  | NoDeviceLimit
  | LimitedToMultipleDevices;
export enum LoginDeviceLimitFlowStage {
  OneDeviceLimitReached = "OneDeviceLimitReached",
  UnlinkingAndOpeningSession = "UnlinkingAndOpeningSession",
  RefreshingDeviceLimitStatus = "RefreshingDeviceLimitStatus",
  OpeningSessionAfterDeviceLimitRemoval = "OpeningSessionAfterDeviceLimitRemoval",
  DeviceLimitDone = "DeviceLimitDone",
}
export interface DeviceLimitCommonContext {
  readonly login: string;
  readonly subscriptionCode: string;
}
export interface OneDeviceLimitReachedStage extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.OneDeviceLimitReached;
  readonly deviceLimitStatus: LimitedToOneDevice;
}
export interface RefreshingDeviceLimitStatusStage
  extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus;
  readonly deviceLimitStatus: Exclude<DeviceLimitStatus, NoDeviceLimit>;
}
export interface OpeningSessionAfterDeviceLimitRemovalStage
  extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval;
}
export interface UnlinkingAndOpeningSessionStage
  extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.UnlinkingAndOpeningSession;
  readonly deviceLimitStatus: Exclude<DeviceLimitStatus, NoDeviceLimit>;
}
export interface DeviceLimitDoneStage extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.DeviceLimitDone;
}
export type LoginDeviceLimitFlow =
  | OneDeviceLimitReachedStage
  | RefreshingDeviceLimitStatusStage
  | OpeningSessionAfterDeviceLimitRemovalStage
  | UnlinkingAndOpeningSessionStage
  | DeviceLimitDoneStage;
