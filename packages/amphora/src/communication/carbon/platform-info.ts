import { browser, os } from "@dashlane/browser-utils";
import { PlatformInfo } from "@dashlane/communication";
import { runtimeGetManifest } from "@dashlane/webextensions-apis";
import { getApplicationBuildType } from "./get-application-build-type";
export async function getPlatformInfo(): Promise<PlatformInfo> {
  const buildType = await getApplicationBuildType();
  return {
    platformName: "server_standalone",
    appVersion: runtimeGetManifest().version,
    browser: browser.getBrowserName(),
    browserVersion: browser.getBrowserVersion(),
    country: browser.getBrowserCountry(),
    os: os.getOSName() ?? "",
    osCountry: browser.getBrowserCountry(),
    osVersion: os.getOSVersion(),
    lang: browser.getBrowserLanguage(),
    manifestVersion: runtimeGetManifest().manifest_version,
    buildType,
  };
}
