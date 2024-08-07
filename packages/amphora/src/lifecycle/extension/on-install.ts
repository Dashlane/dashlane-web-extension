import { runtimeOnInstalled } from "@dashlane/webextensions-apis";
export function onInstall(
  callback: (details: chrome.runtime.InstalledDetails) => void
): void {
  runtimeOnInstalled.addListener(callback);
}
