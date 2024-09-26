import { CodeName } from "@dashlane/communication";
import { LogLevel, Silent } from "Logs/Debugger/types";
export enum DashlaneAPISchemesNames {
  DASHLANE_API_HOST_WITH_SCHEME = "DASHLANE_API_HOST_WITH_SCHEME",
  DASHLANE_WS_HOST_WITH_SCHEME = "DASHLANE_WS_HOST_WITH_SCHEME",
}
export interface DashlaneAPISchemes {
  [DashlaneAPISchemesNames.DASHLANE_API_HOST_WITH_SCHEME]: string;
  [DashlaneAPISchemesNames.DASHLANE_WS_HOST_WITH_SCHEME]: string;
}
export type ManifestVersion = 2 | 3;
export interface CarbonConfig extends DashlaneAPISchemes {
  LOG_LEVEL: LogLevel | typeof Silent;
  LOG_TAGS: string[] | string;
  DASHLANE_API_HOST_WITH_SCHEME: string;
  DASHLANE_WS_HOST_WITH_SCHEME: string;
  DASHLANE_STYX_HOST_WITH_SCHEME: string;
  CODE_NAME: CodeName | null;
  MANIFEST_VERSION: ManifestVersion | null;
}
const defaultConfig: CarbonConfig = {
  LOG_LEVEL: Silent,
  LOG_TAGS: [],
  DASHLANE_API_HOST_WITH_SCHEME: "*****",
  DASHLANE_WS_HOST_WITH_SCHEME: "*****",
  DASHLANE_STYX_HOST_WITH_SCHEME: "*****",
  CODE_NAME: null,
  MANIFEST_VERSION: null,
};
export let config: CarbonConfig = defaultConfig;
const verifyAPISchemesOverride = (
  configOverride: Partial<CarbonConfig>
): Partial<CarbonConfig> => {
  Object.values(DashlaneAPISchemesNames).forEach((scheme) => {
    if (scheme in configOverride && !configOverride[scheme]) {
      configOverride[scheme] = defaultConfig[scheme];
    }
  });
  return configOverride;
};
export const setConfig = (configOverride: Partial<CarbonConfig>): void => {
  config = {
    ...config,
    ...verifyAPISchemesOverride(configOverride),
  };
};
