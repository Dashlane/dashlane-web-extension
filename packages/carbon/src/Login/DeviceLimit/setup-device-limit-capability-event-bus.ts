import { LoginServices } from "Login/dependencies";
import {
  DeviceLimitFlowEventsManager,
  EntryEvent,
  ExitEvent,
} from "Login/DeviceLimit/device-limit-flow-events-manager";
import { refreshDeviceLimitStatus } from "Login/DeviceLimit/device-limit.utils";
import { deviceLimitStatusUpdated } from "Login/DeviceLimit/Store/loginDeviceLimitFlow/actions";
import { DeviceLimitCapabilityEventBus } from "Login/DeviceLimit/device-limit-capability-event-bus";
import { LoginDeviceLimitFlowStage } from "@dashlane/communication";
const handleDeviceLimitCapabilityUpdated = (services: LoginServices) => {
  const action = deviceLimitStatusUpdated();
  services.storeService.dispatch(action);
  refreshDeviceLimitStatus(services);
};
const config = {
  deviceLimitCapabilityUpdated: {
    handler: handleDeviceLimitCapabilityUpdated,
  },
};
const ONE_DEVICE_REACHED_ENTRY_EVENT: EntryEvent = {
  type: "entry",
  to: LoginDeviceLimitFlowStage.OneDeviceLimitReached,
};
const ONE_DEVICE_REACHED_EXIT_EVENT: ExitEvent = {
  type: "exit",
  from: LoginDeviceLimitFlowStage.OneDeviceLimitReached,
};
const MULTIPLE_DEVICES_REACHED_ENTRY_EVENT: EntryEvent = {
  type: "entry",
  to: LoginDeviceLimitFlowStage.MultipleDevicesLimitReached,
};
const MULTIPLE_DEVICES_REACHED_EXIT_EVENT: ExitEvent = {
  type: "exit",
  from: LoginDeviceLimitFlowStage.MultipleDevicesLimitReached,
};
export const setupDeviceLimitEventBus = (
  deviceLimitEventBus: DeviceLimitCapabilityEventBus,
  eventManager: DeviceLimitFlowEventsManager
) => {
  let unregister: () => void;
  const connect = () => (unregister = deviceLimitEventBus.register(config));
  const disconnect = () => unregister();
  eventManager.addEventListener(ONE_DEVICE_REACHED_ENTRY_EVENT, connect);
  eventManager.addEventListener(ONE_DEVICE_REACHED_EXIT_EVENT, disconnect);
  eventManager.addEventListener(MULTIPLE_DEVICES_REACHED_ENTRY_EVENT, connect);
  eventManager.addEventListener(
    MULTIPLE_DEVICES_REACHED_EXIT_EVENT,
    disconnect
  );
};
