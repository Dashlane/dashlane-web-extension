export function secureDeviceName(deviceName: string): string {
  if (!deviceName) {
    return deviceName;
  }
  return deviceName.replace(" ");
}
