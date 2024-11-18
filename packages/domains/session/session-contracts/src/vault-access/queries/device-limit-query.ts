import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export interface NotLimited {
  isLimited: false;
}
export enum PlatformView {
  Android = "android",
  DesktopMacOS = "macosx",
  DesktopWindows = "windows",
  IPad = "ipad",
  IPhone = "iphone",
  IPod = "ipod",
  Other = "other",
  StandaloneExtension = "saex",
  TeamAdminConsole = "tac",
  WebApp = "webapp",
}
export interface DeviceToDeactivateInfo {
  deviceId: string;
  deviceName: null | string;
  platform: PlatformView;
  lastActivityDate: number;
  isPairingGroup?: boolean;
  isCurrentDevice?: boolean;
}
export interface Limited {
  isLimited: true;
}
export type IsDeviceLimited = NotLimited | Limited;
export class DeviceLimitQuery extends defineQuery<IsDeviceLimited>({
  scope: UseCaseScope.User,
}) {}
