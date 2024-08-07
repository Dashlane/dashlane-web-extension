import { onInstall } from "./on-install";
export function onUpdate(
  callback: (details: chrome.runtime.InstalledDetails) => void
): void {
  onInstall((details) => {
    if (details.reason === "update") {
      callback(details);
    }
  });
}
