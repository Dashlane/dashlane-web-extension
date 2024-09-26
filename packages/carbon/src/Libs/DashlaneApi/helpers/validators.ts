export function isEmailTokenValid(token: string) {
  return /^\d{6}$/.test(token);
}
export function isExtraDeviceTokenValid(token: string) {
  return /^[A-Za-z0-9+/]{64}$/.test(token);
}
