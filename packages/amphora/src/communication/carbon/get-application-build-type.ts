import { runtimeGetURL } from "@dashlane/webextensions-apis";
import { ApplicationBuildType } from "@dashlane/communication";
import { RuntimeConfig } from "./runtime-config.types";
import { logger } from "../../logs/app-logger";
const RUNTIME_CONFIG_FILENAME = "runtime-config.json";
function getBuildTypeFromFile(
  runtimeConfigJson: Record<string, unknown>
): ApplicationBuildType {
  const isValidBuildType =
    runtimeConfigJson.buildType &&
    typeof runtimeConfigJson.buildType === "string" &&
    Object.values(ApplicationBuildType)
      .map((val) => val.toString())
      .includes(runtimeConfigJson.buildType);
  if (!isValidBuildType) {
    throw new Error("Build type from runtime-config.json is invalid");
  }
  return ApplicationBuildType[
    runtimeConfigJson.buildType as keyof typeof ApplicationBuildType
  ];
}
const getRuntimeConfig = async (): Promise<RuntimeConfig> => {
  try {
    const runtimeConfigUrl = runtimeGetURL(RUNTIME_CONFIG_FILENAME);
    if (!runtimeConfigUrl) {
      throw new Error("Could not build path to runtime-config.json");
    }
    const response = await fetch(runtimeConfigUrl);
    const runtimeConfigJson = (await response.json()) as Record<
      string,
      unknown
    >;
    const runtimeConfig: RuntimeConfig = {
      buildType: getBuildTypeFromFile(runtimeConfigJson),
    };
    return runtimeConfig;
  } catch (error) {
    logger.error("Unable to read buildType from runtime-config.json", {
      error,
    });
    const defaultRuntimeConfig: RuntimeConfig = {
      buildType: ApplicationBuildType.__REDACTED__,
    };
    return defaultRuntimeConfig;
  }
};
export const getApplicationBuildType =
  async (): Promise<ApplicationBuildType> => {
    const { buildType } = await getRuntimeConfig();
    return buildType;
  };
