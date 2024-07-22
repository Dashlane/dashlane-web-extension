import { equals } from 'ramda';
import { base64ToArrayBuffer } from '@dashlane/framework-encoding';
import { TrustedDeviceFlowMachineState } from '../flows/trusted-device-flow';
export const assertUnreachable = (): never => {
    throw new Error("Didn't expect to get here");
};
export const compareMachines = (prevState: TrustedDeviceFlowMachineState, currState: TrustedDeviceFlowMachineState): boolean => {
    const isSameStep = currState.matches(prevState.value);
    const isSameContext = equals(prevState.context, currState.context);
    return isSameStep && isSameContext;
};
export const REQUEST_TIMEOUT_DELAY = 60 * 1000;
export const getDelayBeforeRequestExpiry = (requestTimestamp: number) => 1000 * requestTimestamp + REQUEST_TIMEOUT_DELAY - Date.now();
export const base64ToUInt8Array = (data: string) => new Uint8Array(base64ToArrayBuffer(data));
const UNDEFINED_COUNTRY = 'ZZ';
export function makeSafeCountry(country: string) {
    if (!country || country.length < 2 || country.length > 5) {
        return UNDEFINED_COUNTRY;
    }
    return country;
}
const UNDEFINED_LANGUAGE = 'und';
export function makeSafeLanguage(language: string) {
    if (!language || language.length < 2 || language.length > 5) {
        return UNDEFINED_LANGUAGE;
    }
    return language;
}
const DEFAULT_DEVICE_NAME = 'Device';
export function makeSafeDeviceName(deviceName: string) {
    return deviceName || DEFAULT_DEVICE_NAME;
}
export function secureDeviceName(deviceName: string): string {
    if (!deviceName) {
        return deviceName;
    }
    return deviceName.replace(/*****/, ' ');
}
