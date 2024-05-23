import { AbortDeviceLimitFlowResult, UnlinkPreviousDeviceResult, } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export interface OneDeviceLimitReachedStage {
    logOut: () => Promise<AbortDeviceLimitFlowResult>;
    unlinkPreviousDevice: () => Promise<UnlinkPreviousDeviceResult>;
}
export function useOneDeviceLimitReachedStage() {
    return {
        logOut: () => carbonConnector.abortDeviceLimitFlow(),
        unlinkPreviousDevice: () => carbonConnector.unlinkPreviousDevice(),
    };
}
