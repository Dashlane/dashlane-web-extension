import { PlatformView } from "./device-info.views";
export interface PreviousDeviceInfo {
  platform: PlatformView;
  name: string;
  lastActive: number;
}
