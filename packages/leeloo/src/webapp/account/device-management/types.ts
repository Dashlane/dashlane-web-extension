import * as communication from '@dashlane/communication';
import { Lee } from 'lee';
export interface DeviceManagementProps {
    devices: DeviceInfo[];
    onNavigateOut: () => void;
    lee: Lee;
}
export type DeviceInfo = communication.DeviceInfo;
