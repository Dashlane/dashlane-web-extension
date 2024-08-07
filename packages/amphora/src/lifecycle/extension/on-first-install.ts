import { onInstall } from "./on-install";
export function onFirstInstall(
  callback: (details: chrome.runtime.InstalledDetails) => void
): void {
  onInstall((details) => {
    if (details.reason === "install") {
      callback(details);
    }
  });
}
