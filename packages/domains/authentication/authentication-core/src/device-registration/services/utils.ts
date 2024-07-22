export const assertUnreachable = (): never => {
    throw new Error("Didn't expect to get here");
};
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
