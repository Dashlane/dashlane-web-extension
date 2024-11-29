export function toUint8Array(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}
