import { Unsubscribe } from "ts-event-bus/build/Slot";
import { DeviceLimitCapabilityEvents } from "@dashlane/communication";
import { LoginServices } from "Login/dependencies";
export type DeviceLimitCapabilityEventHandler = (
  services: LoginServices
) => void;
export interface DeviceLimitCapabilityEventRegistrationConfig {
  handler: DeviceLimitCapabilityEventHandler;
}
export type DeviceLimitCapabilityEventBusConfig = {
  [event in keyof DeviceLimitCapabilityEvents]: DeviceLimitCapabilityEventRegistrationConfig;
};
export class DeviceLimitCapabilityEventBus {
  private readonly connector: DeviceLimitCapabilityEvents;
  private readonly services: LoginServices;
  public constructor(
    services: LoginServices,
    connector: DeviceLimitCapabilityEvents
  ) {
    this.services = services;
    this.connector = connector;
  }
  public register(config: DeviceLimitCapabilityEventBusConfig) {
    const unsubscribes: Unsubscribe[] = [];
    Object.keys(config).forEach((event) => {
      const { handler } = config[event];
      const unsubscribe = this.connector[event].on(() =>
        handler(this.services)
      );
      unsubscribes.push(unsubscribe);
    });
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }
}
