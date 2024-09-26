import { slot } from "ts-event-bus";
export const DeviceLimitCapabilityConnector = {
  deviceLimitCapabilityUpdated: slot<void>(),
};
export type DeviceLimitCapabilityEvents = typeof DeviceLimitCapabilityConnector;
