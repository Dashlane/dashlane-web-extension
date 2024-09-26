import {
  type ApplicationModulesAccessInitOption,
  type CarbonApiEvents,
  CarbonDebugConnector,
  CarbonLeelooConnector,
  CarbonMaverickConnector,
  type DeviceLimitCapabilityEvents,
  ExtensionCarbonConnector,
  type PlatformInfo,
} from "@dashlane/communication";
import { CarbonConfig } from "config-service";
import { CarbonPlugins } from "Libs/Plugins";
import { SyncApplicationSettings } from "Application/Store/applicationSettings";
import { AsyncStorage } from "Libs/Storage/types";
import { CarbonE2EConnector } from "Connector/CarbonE2EConnector";
import { AppSessionStorage } from "Store/types";
export interface Infrastructure {
  connectors: {
    deviceLimit?: DeviceLimitCapabilityEvents;
  };
}
export interface Connectors {
  leeloo?: typeof CarbonLeelooConnector;
  extension?: typeof ExtensionCarbonConnector;
  maverick?: typeof CarbonMaverickConnector;
  debug?: typeof CarbonDebugConnector;
  e2e?: CarbonE2EConnector;
  api?: CarbonApiEvents;
}
export type InitApplicationSettings = {
  sync?: SyncApplicationSettings;
  userABTestNames?: string[];
  migratedToSAEX?: boolean;
  desktopLogin?: string;
};
export interface InitOptions {
  storageLayer: AsyncStorage;
  sessionStorage?: AppSessionStorage;
  platformInfo: PlatformInfo;
  abTestForcedVersion?: string;
  connectors: Connectors;
  infrastructure?: Infrastructure;
  publicPath: string;
  plugins?: CarbonPlugins;
  anonymousPartnerId?: string;
  keys?: {
    appAccess: string;
    appSecret: string;
    styxAccess: string;
    styxSecret: string;
    cloudflareAccess?: string;
    cloudflareSecret?: string;
  };
  settings?: InitApplicationSettings;
  config?: Partial<CarbonConfig>;
  createClients: ApplicationModulesAccessInitOption;
}
