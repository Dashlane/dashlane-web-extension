import {
  App,
  Browser,
  BuildType,
  Os,
  OsType,
  Platform,
} from "@dashlane/hermes";
import {
  ApplicationBuildType,
  PlatformInfo,
  PlatformString,
} from "@dashlane/communication";
import { browser, navigator as navigatorHelper } from "@dashlane/browser-utils";
import { config, ManifestVersion } from "config-service";
import { StoreService } from "Store/index";
import { CoreServices } from "Services";
import { assertUnreachable } from "Helpers/assert-unreachable";
export const createLogger = (services: CoreServices) => {
  const { eventLoggerService } = services;
  const logRepository = eventLoggerService.getRepository("createLogger");
  const logger = logRepository.createLogger();
  return { logger, logRepository };
};
export const platformStringToAppPlatform = (
  platformString: PlatformString
): Platform => {
  switch (platformString) {
    case "server_standalone":
    case "server_carbon_unknown":
    case "server_carbon_tests":
      return Platform.Saex;
    case "server_leeloo_dev":
    case "server_leeloo":
    case "server_tac":
      return Platform.Web;
    default:
      assertUnreachable(
        platformString,
        `Hermes Web SDK: Unsupported platform "${platformString}" detected. This platform is not supported by the Hermes Web SDK or Styx API.`
      );
  }
};
export const applicationBuildTypeToHermesBuildType = (
  applicationBuildType?: ApplicationBuildType
) => {
  switch (applicationBuildType) {
    case ApplicationBuildType.DEV:
      return BuildType.Dev;
    case ApplicationBuildType.QA:
      return BuildType.Qa;
    case ApplicationBuildType.__REDACTED__:
      return BuildType.__REDACTED__;
    default:
      return BuildType.__REDACTED__;
  }
};
const buildVersionField = (
  appVersion: string,
  manifestVersion: ManifestVersion | null
): string => {
  return manifestVersion ? appVersion + "-mv" + manifestVersion : appVersion;
};
export const getAppContext = (storeService: StoreService): App => {
  const platformInfo = storeService.getPlatformInfo();
  const { buildType } = platformInfo;
  return {
    platform: platformStringToAppPlatform(platformInfo.platformName),
    version: buildVersionField(
      platformInfo.appVersion,
      config.MANIFEST_VERSION
    ),
    build_type: applicationBuildTypeToHermesBuildType(buildType),
  };
};
export const getBrowserContext = (): Browser => {
  const name = browser.getBrowserName();
  const version = browser.getBrowserVersion();
  const userAgent = navigatorHelper.getNavigator().userAgent;
  return {
    name,
    version,
    user_agent: userAgent,
  };
};
export const getOsType = (platformInfo: PlatformInfo): OsType => {
  let osType = OsType.Other;
  const osSnake = platformInfo.os.toLowerCase().replace(/[ -/]+/g, "_");
  const isValidOsType = Object.values(OsType)
    .map((val) => val.toString())
    .includes(osSnake);
  if (isValidOsType) {
    osType = osSnake as OsType;
  }
  return osType;
};
export const getOsVersion = (platformInfo: PlatformInfo): string => {
  const formattedOSVersion =
    platformInfo.os === "Mac OS"
      ? platformInfo.osVersion.replace("OS_X_", "").replace(/_/g, ".")
      : platformInfo.osVersion;
  const osVersionRegex = /([0-9]{1,3}(?:\.[0-9]{0,4}){0,2})/;
  const match = osVersionRegex.exec(formattedOSVersion);
  if (match && match.length >= 2) {
    return match[1];
  }
  return "0";
};
export const getOsContext = (storeService: StoreService): Os => {
  const platformInfo = storeService.getPlatformInfo();
  const osType = getOsType(platformInfo);
  const osVersion = getOsVersion(platformInfo);
  return {
    type: osType,
    version: osVersion,
    locale: platformInfo.lang,
  };
};
export function chunkArray<T>(
  array: Array<T>,
  chunkSize: number
): Array<Array<T>> {
  if (array.length <= chunkSize) {
    return [array];
  }
  return [
    array.slice(0, chunkSize),
    ...chunkArray(array.slice(chunkSize), chunkSize),
  ];
}
