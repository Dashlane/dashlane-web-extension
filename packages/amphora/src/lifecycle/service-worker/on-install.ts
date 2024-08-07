export function onInstall(callback: (event: Event) => void): void {
  self.addEventListener("install", callback);
}
