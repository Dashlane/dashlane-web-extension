export function getUnixTimestamp(): number {
  return Math.round(Date.now() / 1000);
}
