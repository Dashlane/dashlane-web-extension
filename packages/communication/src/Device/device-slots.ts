import { slot } from "ts-event-bus";
import { PlatformInfo } from "../Logging";
export const deviceQueriesSlots = {
  getAnonymousComputerId: slot<void, string>(),
  getPlatformInfo: slot<void, PlatformInfo>(),
};
export const deviceCommandsSlots = {
  cleanRemotelyRemovedProfiles: slot<void, void>(),
};
