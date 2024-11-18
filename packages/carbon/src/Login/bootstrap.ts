import { CommandQueryBus } from "Shared/Infrastructure";
import { Infrastructure } from "init-options";
import { CoreServices } from "Services";
import { config as commandQueryBusConfig } from "Login/Api/config";
import { setupDeviceLimitEventBus } from "Login/DeviceLimit/setup-device-limit-capability-event-bus";
import { DeviceLimitCapabilityEventBus } from "Login/DeviceLimit/device-limit-capability-event-bus";
import { getDeviceLimitFlowEventsManager } from "Login/DeviceLimit/device-limit-flow-events-manager";
export const bootstrap = (
  commandQueryBus: CommandQueryBus,
  services: CoreServices,
  infrastructure: Infrastructure
) => {
  commandQueryBus.register(commandQueryBusConfig);
  if (infrastructure.connectors.deviceLimit) {
    const eventBus = new DeviceLimitCapabilityEventBus(
      services,
      infrastructure.connectors.deviceLimit
    );
    const transitionManager = getDeviceLimitFlowEventsManager(
      services.storeService
    );
    setupDeviceLimitEventBus(eventBus, transitionManager);
  }
};
