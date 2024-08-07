export function encodeAntiPhishingToken(phishingDomain: string): string {
  return btoa(encodeURIComponent(phishingDomain));
}
