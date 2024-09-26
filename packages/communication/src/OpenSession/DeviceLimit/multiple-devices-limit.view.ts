import { PlatformView } from "./device-info.views";
export interface DeviceToDeactivateInfoView {
  deviceId: string;
  deviceName: null | string;
  platform: PlatformView;
  lastActivityDate: number;
  isPairingGroup?: boolean;
  isCurrentDevice?: boolean;
}
