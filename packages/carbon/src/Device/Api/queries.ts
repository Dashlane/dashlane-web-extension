import { PlatformInfo } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type DeviceQueries = {
  getAnonymousComputerId: Query<void, string>;
  getPlatformInfo: Query<void, PlatformInfo>;
};
