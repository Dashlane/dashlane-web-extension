export interface DeviceKeys {
  accessKey: string;
  secretKey: string;
}
export const convertUkiToDeviceKeys = (uki: string): DeviceKeys | null => {
  if (uki) {
    const keys: string[] = uki.split("-");
    if (keys.length > 0) {
      const [accessKey] = keys;
      return {
        accessKey,
        secretKey: uki,
      };
    }
  }
  return null;
};
export const convertDeviceKeysToUki = (deviceKeys: DeviceKeys) => {
  return `${deviceKeys.accessKey}-${deviceKeys.secretKey}`;
};
