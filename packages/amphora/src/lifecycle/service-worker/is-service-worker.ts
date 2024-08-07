export function isServiceWorker(): boolean {
  return "serviceWorker" in self;
}
